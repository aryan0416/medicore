from langchain_huggingface import HuggingFaceEmbeddings
from app.config import EMBEDDING_MODEL

_embedding_instance = None

def get_embedding_model():
    """
    Returns the HuggingFace embedding model for vector generation.
    """
    global _embedding_instance
    if _embedding_instance is not None:
        return _embedding_instance
        
    print(f"Loading embedding model: {EMBEDDING_MODEL}")
    embeddings = HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL
    )
    _embedding_instance = embeddings
    return embeddings
