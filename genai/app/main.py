import asyncio
import sys
from psycopg_pool import AsyncConnectionPool
from psycopg.rows import dict_row
from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver
from langchain_core.messages import HumanMessage
from .clients import (
    rich, PSQL_USERNAME, PSQL_PASSWORD, PSQL_HOST, 
    PSQL_PORT, PSQL_DATABASE, PSQL_SSLMODE
)
from .graph import create_graph
from .utils import process_chunks, process_checkpoints


async def main():
    conninfo = (
        f"postgres://{PSQL_USERNAME}:{PSQL_PASSWORD}"
        f"@{PSQL_HOST}:{PSQL_PORT}/{PSQL_DATABASE}"
        f"?sslmode={PSQL_SSLMODE}"
    )

    async with AsyncConnectionPool(
        conninfo=conninfo,
        max_size=20,
        kwargs={"autocommit": True, "prepare_threshold": 0, "row_factory": dict_row},
    ) as pool, pool.connection() as conn:
        
        memory = AsyncPostgresSaver(conn)
        await memory.setup()

        app_builder = create_graph()
        
        langgraph_agent = app_builder.compile(checkpointer=memory)

        while True:
            user_question = input("\nUser:\n")

            if user_question.lower() == "quit":
                rich.print("\nAgent:\nHave a nice day! :wave:\n", style="black on white")
                break
            
            invocation_input = {"messages": [HumanMessage(content=user_question)]}
            user_msg_lower = user_question.lower()

            if "brain xray" in user_msg_lower:
                invocation_input["imageURL"] = TEST_IMAGE_URLS["brain"]
                rich.print(f"[yellow]DEBUG: Attaching test brain image URL.[/yellow]")
            elif "chest xray" in user_msg_lower:
                invocation_input["imageURL"] = TEST_IMAGE_URLS["chest"]
                rich.print(f"[yellow]DEBUG: Attaching test chest image URL.[/yellow]")
            elif "wound" in user_msg_lower:
                invocation_input["imageURL"] = TEST_IMAGE_URLS["wound"]
                rich.print(f"[yellow]DEBUG: Attaching test wound image URL.[/yellow]")

            thread_id = "test-thread-1"

            async for chunk in langgraph_agent.astream(
                invocation_input,
                {"configurable": {"thread_id": thread_id}},
            ):
                process_chunks(chunk)

            checkpoints = memory.alist({"configurable": {"thread_id": thread_id}})
            await process_checkpoints(checkpoints)

if __name__ == "__main__":
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

    asyncio.run(main())