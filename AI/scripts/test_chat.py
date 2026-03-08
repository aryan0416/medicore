import sys
import traceback
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from rag.rag_pipeline import generate_answer

if __name__ == "__main__":
    try:
        result = generate_answer("What is hypertension?")
        print("Result:", result)
    except Exception as e:
        traceback.print_exc()
