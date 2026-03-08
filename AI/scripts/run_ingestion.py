import os
import sys

# Add the project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from ingestion.load_documents import load_all_documents
from ingestion.chunk_documents import chunk_documents
from models.embedding_model import get_embedding_model
from retrieval.vector_store import create_vector_store_from_documents

RAW_DOCS_DIR = "data/raw_documents"

def run_ingestion():
    print("--- Starting Clinical Data Ingestion Pipeline ---")
    
    # 1. Load Documents
    print(f"\n[1] Loading documents from {RAW_DOCS_DIR}...")
    documents = load_all_documents(RAW_DOCS_DIR)
    
    if not documents:
        print(f"No documents found in {RAW_DOCS_DIR}. Please add some medical guidelines, PDFs, or text files and try again.")
        return
        
    # 2. Chunk Documents
    print("\n[2] Chunking documents...")
    chunks = chunk_documents(documents)
    
    # 3. Initialize Embedding Model
    print("\n[3] Initializing Embedding Model...")
    embeddings_model = get_embedding_model()
    
    # 4. Create Embeddings & Store in Vector DB
    print("\n[4] Creating Vector Database...")
    create_vector_store_from_documents(chunks, embeddings_model)
    
    print("\n--- Ingestion Pipeline Completed Successfully! ---")
    print("You can now start the API server with: uvicorn app.main:app --reload")

if __name__ == "__main__":
    run_ingestion()
