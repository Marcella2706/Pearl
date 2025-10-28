import os
import boto3
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from rich.console import Console
load_dotenv()

BUCKET_NAME = "health-pearl"
REGION = "ap-south-1"
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
DATABASE_URL = os.getenv("DATABASE_URL")

openAi_Client = ChatOpenAI(model="gpt-4", temperature=0, api_key=OPENAI_API_KEY)
s3Client = boto3.client("s3", region_name=REGION)
rich = Console()

PSQL_USERNAME = os.getenv("PSQL_USERNAME")
PSQL_PASSWORD = os.getenv("PSQL_PASSWORD")
PSQL_HOST = os.getenv("PSQL_HOST")
PSQL_PORT = os.getenv("PSQL_PORT")
PSQL_DATABASE = os.getenv("PSQL_DATABASE")
PSQL_SSLMODE = os.getenv("PSQL_SSLMODE")