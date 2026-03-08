from models.llm_model import get_llm
from models.embedding_model import get_embedding_model
from retrieval.retriever import get_retriever
from rag.context_builder import build_context
from rag.prompt_template import get_rag_prompt
from app.supabase_client import fetch_patient_history

def generate_answer(query: str, patient_id: str = None):
    """
    Executes the full Retrieval-Augmented Generation pipeline.
    """
    try:
        # 1. Initialize models and retriever
        embeddings = get_embedding_model()
        retriever = get_retriever(embeddings, k=5)
        llm = get_llm()
        
        if not retriever:
            return {
                "answer": "System requires ingestion of documents first. Please run the ingestion script.", 
                "sources": [], 
                "reasoning": "Vector store not initialized."
            }
            
        # 2. Retrieve relevant chunks
        docs = retriever.invoke(query)
        if not docs:
            return {
                "answer": "Insufficient evidence to answer this question.",
                "sources": [],
                "reasoning": "No relevant documents found in the database."
            }
            
        # 3. Build context
        context = build_context(docs)
        
        # 3.5 Inject Real-Time Supabase Data if Patient ID is provided
        if patient_id:
            print(f"Fetching real-time data for Patient: {patient_id}")
            realtime_data = fetch_patient_history(patient_id)
            context = f"=== REAL-TIME PATIENT RECORD ===\n{realtime_data}\n\n=== MEDICAL GUIDELINES ===\n{context}"
        
        # 4. Prepare prompt
        prompt_template = get_rag_prompt()
        prompt = prompt_template.format_messages(context=context, question=query)
        
        # 5. Generate Answer
        response = llm.invoke(prompt)
        
        # 6. Extract sources mapping
        sources = list(set([doc.metadata.get("source", "Unknown") for doc in docs]))
        
        return {
            "answer": response.content,
            "sources": sources,
            "reasoning": "Generated using clinical RAG pipeline based on retrieved documents."
        }
        
    except Exception as e:
        print(f"Error in RAG pipeline: {e}")
        return {
            "answer": "An error occurred during RAG processing.",
            "sources": [],
            "reasoning": str(e)
        }
