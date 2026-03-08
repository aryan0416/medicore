from langchain_openai import ChatOpenAI
from app.config import OPENAI_API_KEY
import os

if __name__ == "__main__":
    if not OPENAI_API_KEY:
        print("No OPENAI_API_KEY found in config.")
    else:
        try:
            print("Testing OpenAI connection...")
            llm = ChatOpenAI(api_key=OPENAI_API_KEY, model="gpt-4o-mini")
            response = llm.invoke("Hello, are you working?")
            print("OpenAI says:", response.content)
        except Exception as e:
            print("OpenAI test failed:", e)
