import json
from fastapi import APIRouter, Depends, Header, HTTPException, Request, BackgroundTasks
from fastapi.responses import StreamingResponse
from langchain_core.messages import HumanMessage, AIMessage,SystemMessage
import requests
from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session 
from .schemas import (
    ChatRequest, ChatResponseChunk, SessionCreate, 
    SessionResponse, MessageCreate, MessageResponse, SessionUpdate
)
from app.db import get_db, SessionLocal
from app import crud, models
from app.clients import openAi_Client

BACKEND_URL = "http://localhost:2706/api/v1/user/current-user"

def get_current_user(authorization: str = Header(None)) -> dict:
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")
    try:
        response = requests.get(
            BACKEND_URL,
            headers={"Authorization": authorization},
            timeout=5
        )
        response.raise_for_status()
        user_data = response.json()
        if "email" not in user_data:
            raise HTTPException(status_code=401, detail="Invalid user data from auth service")
        return user_data
    except requests.exceptions.HTTPError as e:
        raise HTTPException(status_code=e.response.status_code, detail="Unauthorized")
    except requests.exceptions.RequestException:
        raise HTTPException(status_code=500, detail="Auth service unreachable")

def get_langgraph_agent(request: Request):
    return request.app.state.langgraph_agent

router = APIRouter(prefix="/sessions", tags=["Sessions & Chat"])

@router.post("/", response_model=SessionResponse)
def create_new_session(
    session_in: SessionCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Creates a new, empty chat session for the current user.
    """
    user_email = current_user.get("email")
    user = crud.get_or_create_user(db, email=user_email)
    session = crud.create_session(db, user_id=user.id, session_in=session_in)
    return session

@router.get("/", response_model=List[SessionResponse])
def get_all_user_sessions(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Gets a list of all chat sessions for the current user.
    """
    user_email = current_user.get("email")
    user = crud.get_user_by_email(db, email=user_email)
    if not user:
        return [] 
    return crud.get_user_sessions(db, user_id=user.id)

@router.post("/{session_id}/chat", response_model=ChatResponseChunk)
async def chat_with_bot(
    session_id: UUID,
    message: ChatRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
    agent = Depends(get_langgraph_agent)
):
    """
    Main chat endpoint. Receives a message, runs it through the graph,
    and streams the response.
    """
    if not agent:
        raise HTTPException(status_code=503, detail="Graph not initialized")

    user_email = current_user.get("email")
    user = crud.get_or_create_user(db, email=user_email)
    if not crud.check_session_owner(db, session_id=session_id, user_id=user.id):
        raise HTTPException(status_code=404, detail="Session not found or not owned by user")
    thread_id = str(session_id)

    user_msg_lower = message.content.lower()
    image_url = message.imageURL

    if not image_url:
        if "brain xray" in user_msg_lower:
            image_url = TEST_IMAGE_URLS["brain"]

    # Save human message(s): text message first, and if there's an image URL, save it separately as a human message (URL only)
    crud.add_message(db, session_id, MessageCreate(role="human", content=message.content))
    if image_url:
        crud.add_message(db, session_id, MessageCreate(role="human", content=image_url))

    invocation_input = {"messages": [HumanMessage(content=message.content)]}
    if image_url:
        invocation_input["imageURL"] = image_url

    config = {"configurable": {"thread_id": thread_id}}

    async def stream_generator():
        final_ai_response = ""
        final_image_urls: List[str] = []
        try:
            async for chunk in agent.astream(invocation_input, config):
                node_name = list(chunk.keys())[0]
                node_output = chunk[node_name]

                if not isinstance(node_output, dict):
                    continue

                response_chunk = None

                if "messages" in node_output:
                    ai_message_or_list = node_output["messages"]

                    if isinstance(ai_message_or_list, list):
                        ai_message = ai_message_or_list[-1]
                    else:
                        ai_message = ai_message_or_list

                    if isinstance(ai_message, AIMessage):
                        response_content = ai_message.content
                        final_ai_response += response_content
                        response_chunk = ChatResponseChunk(
                            type="message",
                            content=response_content
                        ).model_dump_json()

                elif "prediction" in node_output:
                    final_nodes = ["HeartNode", "WoundNode", "ChestXRayNode"]
                    if node_name in final_nodes:
                        prediction_content = node_output["prediction"]
                        final_ai_response += prediction_content
                        response_chunk = ChatResponseChunk(
                            type="prediction",
                            content=prediction_content
                        ).model_dump_json()

                if "rImageUrl" in node_output:
                    r_img = node_output["rImageUrl"]
                    urls = r_img if isinstance(r_img, list) else [r_img]
                    for u in urls:
                        if not u:
                            continue
                        final_image_urls.append(u)
                        img_chunk = ChatResponseChunk(
                            type="image",
                            content=u
                        ).model_dump_json()
                        yield f"{img_chunk}\n"

                if response_chunk:
                    yield f"{response_chunk}\n"

            if final_ai_response or final_image_urls:
                with SessionLocal() as db_session:
                    if final_ai_response:
                        crud.add_message(
                            db_session, session_id,
                            MessageCreate(role="ai", content=final_ai_response)
                        )
                    for img_url in final_image_urls:
                        crud.add_message(
                            db_session, session_id,
                            MessageCreate(role="ai", content=img_url)
                        )

        except Exception as e:
            error_chunk = ChatResponseChunk(
                type="error",
                content=str(e)
            ).model_dump_json()
            yield f"{error_chunk}\n"

    return StreamingResponse(stream_generator(), media_type="application/x-ndjson")

@router.get("/{session_id}/messages", response_model=List[MessageResponse])
def get_session_chat_history(
    session_id: UUID,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Gets all messages for a specific chat session.
    Triggers title generation if title is default.
    """
    user_email = current_user.get("email")
    user = crud.get_or_create_user(db, email=user_email)

    if not crud.check_session_owner(db, session_id=session_id, user_id=user.id):
        raise HTTPException(status_code=404, detail="Session not found or not owned by user")
    
    session = crud.get_session(db, session_id=session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found") 

    messages = crud.get_session_messages(db, session_id=session_id)

    if session.title == "New Chat" and len(messages) > 0:
        background_tasks.add_task(_generate_title_task, session_id, messages)
    
    return messages

def _generate_title_task(session_id: UUID, messages: List[models.Message]):
    """
    Uses OpenAI to generate a title for the session and updates the DB.
    """
    print(f"Background task started: Generating title for session {session_id}")
    try:
        conversation_history = "\n".join(
            [f"{msg.role}: {msg.content}" for msg in messages[:2]] 
        )
        
        prompt = f"""You are a title generator. Based on the following conversation, create a very short, concise title (4 words maximum).
        
        Conversation:
        {conversation_history}
        
        Title:"""

        system_message = SystemMessage(content=prompt)
        response = openAi_Client.invoke([system_message])
        
        new_title = response.content.strip().strip('"') 
        
        if not new_title:
            return 
        with SessionLocal() as db:
            crud.update_session_title(db, session_id=session_id, title=new_title)
            print(f"Background task finished: Title for {session_id} set to '{new_title}'")
            
    except Exception as e:
        print(f"Background task failed for session {session_id}: {e}")

@router.patch("/{session_id}", response_model=SessionResponse)
def update_session_title(
    session_id: UUID,
    session_in: SessionUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Manually updates the title of a specific chat session.
    """
    user_email = current_user.get("email")
    user = crud.get_or_create_user(db, email=user_email)

    if not crud.check_session_owner(db, session_id=session_id, user_id=user.id):
        raise HTTPException(status_code=404, detail="Session not found or not owned by user")
    
    updated_session = crud.update_session_title(db, session_id, session_in.title)
    if not updated_session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    return updated_session