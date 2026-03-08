from retrieval.vector_store import get_vector_store

def get_retriever(embeddings_model, k=5):
    """
    Returns a retriever initialized from the vector store for dense retrieval.
    """
    print(f"Initializing retriever to fetch top {k} dense chunk results...")
    try:
        vector_store = get_vector_store(embeddings_model)
        # Using similarity search retriever
        retriever = vector_store.as_retriever(search_kwargs={"k": k})
        return retriever
    except Exception as e:
        print(f"Error initializing retriever. (If this is first usage, must run ingestion). Error: {e}")
        return None
