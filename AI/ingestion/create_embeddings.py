import os
import json
from models.embedding_model import get_embedding_model

def create_embeddings(chunks, output_dir="data/processed_chunks"):
    """
    Generates embeddings for a list of document chunks and optionally saves them.
    LangChain's vectorstore handles this natively, but this serves as an explicit
    pipeline step as requested.
    """
    if not chunks:
        print("No chunks provided for embedding.")
        return chunks, None
        
    print("Initializing embedding model...")
    embeddings_model = get_embedding_model()
    
    # Make sure output directory exists if we want to save processed texts
    os.makedirs(output_dir, exist_ok=True)
    
    print(f"Embedding model ready. Returning model and chunks for Vector Store ingestion.")
    
    # We return the chunks and the instantiated embedding model.
    # The actual vector extraction happens within the vector_store insertion.
    return chunks, embeddings_model
