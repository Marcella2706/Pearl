import asyncio
import sys
import uvicorn
from fastapi import FastAPI
from contextlib import asynccontextmanager
from psycopg_pool import AsyncConnectionPool
from psycopg.rows import dict_row
from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver
from app.db import Base, engine
from app.graph import create_graph
from app.clients import (
    PSQL_USERNAME, PSQL_PASSWORD, PSQL_HOST, 
    PSQL_PORT, PSQL_DATABASE, PSQL_SSLMODE
)
from app.api.routers import router as api_router
from fastapi.middleware.cors import CORSMiddleware

class AppState:
    langgraph_agent = None
    memory = None
    conn_pool = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    conninfo = (
        f"postgres://{PSQL_USERNAME}:{PSQL_PASSWORD}"
        f"@{PSQL_HOST}:{PSQL_PORT}/{PSQL_DATABASE}"
    )
    
    pool = AsyncConnectionPool(
        conninfo=conninfo,
        max_size=20,
        kwargs={"autocommit": True, "prepare_threshold": 0, "row_factory": dict_row},
    )
    AppState.conn_pool = pool

    async with pool.connection() as conn:
        memory = AsyncPostgresSaver(conn)
        await memory.setup()
        AppState.memory = memory

    app_builder = create_graph()
    langgraph_agent = app_builder.compile(checkpointer=AppState.memory)
    AppState.langgraph_agent = langgraph_agent
    
    print("--- Health Bot Server is Ready ---")
    yield
    await AppState.conn_pool.close()
    print("--- Connection Pool Closed ---")

app = FastAPI(
    title="Health Bot API",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","https://jivika.pearl99z.tech"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)
app.state = AppState 

app.include_router(api_router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)