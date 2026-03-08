import os
from langchain_qdrant import QdrantVectorStore
from app.config import VECTOR_DB_PATH, COLLECTION_NAME

_vector_store_instance = None

def get_vector_store(embeddings_model):
    """
    Returns the Qdrant vector store LangChain wrapper initialized locally.
    """
    global _vector_store_instance
    if _vector_store_instance is not None:
        return _vector_store_instance

    os.makedirs(VECTOR_DB_PATH, exist_ok=True)
    
    # Let Langchain parse the path directly rather than injecting a custom client
    vector_store = QdrantVectorStore.from_existing_collection(
        embedding=embeddings_model,
        collection_name=COLLECTION_NAME,
        path=VECTOR_DB_PATH,
    )
    _vector_store_instance = vector_store
    return vector_store

def create_vector_store_from_documents(chunks, embeddings_model):
    """
    Creates a new vector store and ingests documents.
    """
    print(f"Creating vector store at {VECTOR_DB_PATH} and ingesting {len(chunks)} chunks...")
    os.makedirs(VECTOR_DB_PATH, exist_ok=True)
    
    vector_store = QdrantVectorStore.from_documents(
        chunks,
        embeddings_model,
        path=VECTOR_DB_PATH,
        collection_name=COLLECTION_NAME
    )
    
    print("Vector storage ingestion complete.")
    return vector_store
