import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq

load_dotenv()

def test_groq():
    api_key = os.getenv("GROQ_API_KEY")
    model = os.getenv("LLM_MODEL", "llama-3.1-8b-instant")
    
    if not api_key:
        print("Error: GROQ_API_KEY not found in .env")
        return

    print(f"Testing Groq with model: {model}...")
    try:
        llm = ChatGroq(
            model_name=model,
            temperature=0.0,
            api_key=api_key
        )
        response = llm.invoke("Hello, are you working?")
        print("Groq response:", response.content)
    except Exception as e:
        print("Groq test failed:", e)

if __name__ == "__main__":
    test_groq()
