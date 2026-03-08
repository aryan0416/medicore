import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.embedding_model import get_embedding_model
from retrieval.retriever import get_retriever

if __name__ == "__main__":
    embeddings = get_embedding_model()
    retriever = get_retriever(embeddings)
    if retriever:
        print("Retriever initialized. Querying...")
        docs = retriever.invoke("What are clinical guidelines for hypertension?")
        print(f"Retrieved {len(docs)} documents.")
        for i, doc in enumerate(docs):
            print(f"\n--- Doc {i+1} ---")
            print("Content snippet:", doc.page_content[:200])
            print("Metadata:", doc.metadata)
    else:
        print("Failed to initialize retriever.")
