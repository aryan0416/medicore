from langchain_groq import ChatGroq
from langchain_openai import ChatOpenAI
from app.config import LLM_MODEL
import os

_llm_instance = None

def get_llm():
    """
    Returns the configured LLM for generation.
    Supports both Groq and OpenAI as fallback.
    """
    global _llm_instance
    if _llm_instance is not None:
        return _llm_instance

    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    
    groq_llm = ChatGroq(
        model_name=LLM_MODEL,
        temperature=0.0,
        api_key=GROQ_API_KEY or "dummy-key-to-init"
    )

    # Try OpenAI first if key looks valid and doesn't start with 'sk-proj-' dummy
    if OPENAI_API_KEY and not OPENAI_API_KEY.startswith("sk-proj-YOUR"):
        print("Initializing LLM via OpenAI with Groq fallback...")
        try:
            openai_llm = ChatOpenAI(
                model="gpt-4o-mini",
                temperature=0.0,
                api_key=OPENAI_API_KEY
            )
            llm = openai_llm.with_fallbacks([groq_llm])
            _llm_instance = llm
            return llm
        except Exception as e:
            print(f"OpenAI initialization failed: {e}")

    # Fallback entirely to Groq
    print(f"Initializing LLM via Groq: {LLM_MODEL}")
    _llm_instance = groq_llm
    return groq_llm
