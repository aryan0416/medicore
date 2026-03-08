from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from rag.rag_pipeline import generate_answer

app = FastAPI(
    title="Clinical Trust OS - Medical RAG API",
    description="AI microservice for querying medical guidelines and clinical cases.",
    version="1.0.0"
)

class QueryRequest(BaseModel):
    query: str
    patient_id: Optional[str] = None

class QueryResponse(BaseModel):
    answer: str
    sources: list
    reasoning: str

@app.post("/chat", response_model=QueryResponse)
def chat_endpoint(request: QueryRequest):
    """
    Main endpoint for the frontend/backend to interact with the AI logic.
    """
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
        
    try:
        response = generate_answer(request.query, request.patient_id)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "ai-clinical-rag"}
