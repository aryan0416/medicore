import os
from dotenv import load_dotenv

load_dotenv()

# Model Settings
LLM_MODEL = os.getenv("LLM_MODEL", "llama-3.1-8b-instant")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "BAAI/bge-large-en")

# Vector DB Settings
VECTOR_DB_PATH = os.getenv("VECTOR_DB_PATH", "data/vector_db")
COLLECTION_NAME = os.getenv("COLLECTION_NAME", "clinical_documents")

# Chunking Settings
CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", 500))
CHUNK_OVERLAP = int(os.getenv("CHUNK_OVERLAP", 100))

# Supabase Real-Time Data Config
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

# API Keys
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
