import os
import sys

# Add the project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.embedding_model import get_embedding_model
from retrieval.retriever import get_retriever

def test_retriever():
    embeddings = get_embedding_model()
    print("Testing get_retriever...")
    retriever = get_retriever(embeddings)
    if retriever:
        print("Success! Retriever returned:", retriever)
    else:
        print("Failed to get retriever.")

if __name__ == "__main__":
    test_retriever()
