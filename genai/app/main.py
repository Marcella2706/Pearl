from typing import Annotated, Literal,TypedDict,Optional
from langgraph.graph import StateGraph,START,END
from langgraph.graph import MessagesState,add_messages
from langchain_core.messages import SystemMessage,HumanMessage,AIMessage,ToolMessage
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
from langsmith import Client
from prompts import fixerPrompt,clinicalPrompt
import os

load_dotenv()

openai_key=os.getenv("OPENAI_API_KEY")
langsmith_key=os.getenv("LANGSMITH_API_KEY")
langsmith_tracing=os.getenv("LANGSMITH_TRACING")
project_name = os.getenv("LANGSMITH_PROJECT")

openAi_Client =ChatOpenAI(model="gpt-4",temperature=0,api_key=openai_key)



class ChatStateMain(MessagesState):
    imageURL: Optional[str] = None
    pdfURL: Optional[str] = None

def startRouter(state:ChatStateMain) -> Literal['classifierNode', 'pdfSummarizerNode', 'clinicalNode']:
    """Maps The Nodes To The Respective SubGraphs."""
    imageUrl=state.get("imageURL")
    pdfUrl=state.get("pdfURL")
    if imageUrl:
        return "classifierNode"
    elif pdfUrl:
        return "pdfSummarizerNode"
    else:
        return "clinicalNode"

def classifierNode(state:ChatStateMain) -> ChatStateMain:
    return state

def pdfSummarizerNode(state:ChatStateMain) -> ChatStateMain:
    return state

def promptFixerNode(state:ChatStateMain) -> ChatStateMain:
    """Handles the prompt fixing for the user input."""
    message=state.get("messages")[-1].content
    system_message=SystemMessage(fixerPrompt)
    response=openAi_Client.invoke([system_message]+[HumanMessage(content=message)])
    improved_text=response.content
    state.get("messages")[-1].content = improved_text
    return state

def clinicalNode(state:ChatStateMain)-> ChatStateMain:
    """Handles Basic Health Condition Queries""" 
    system_message=SystemMessage(clinicalPrompt)
    response=openAi_Client.invoke([system_message]+[HumanMessage(content=state.get("messages")[-1].content)])
    return {"messages":response}


builder=StateGraph(ChatStateMain)
builder.add_node("promptFixerNode", promptFixerNode)
builder.add_node("clinicalNode", clinicalNode)
builder.add_node("classifierNode", classifierNode)
builder.add_node("pdfSummarizerNode", pdfSummarizerNode)



builder.add_edge(START,"promptFixerNode")
builder.add_conditional_edges("promptFixerNode",startRouter)
builder.add_edge("classifierNode",END)
builder.add_edge("pdfSummarizerNode",END)   
builder.add_edge("clinicalNode",END)

graph=builder.compile()




    