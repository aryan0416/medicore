def build_context(retrieved_docs):
    """
    Combines retrieved document chunks into a single structured context block.
    """
    context_str = ""
    for i, doc in enumerate(retrieved_docs, 1):
        source = doc.metadata.get("source", "Unknown Source")
        content = doc.page_content.strip()
        context_str += f"--- Document {i} (Source: {source}) ---\n{content}\n\n"
    
    return context_str.strip()
