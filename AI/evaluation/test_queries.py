import os
import sys

# Add the project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from rag.rag_pipeline import generate_answer

def run_evaluations():
    """
    Simulates frontend/backend requests to check the quality of answers.
    """
    test_queries = [
        "What is the recommended treatment for hypertension stage 2?",
        "When should ACE inhibitors be used?",
        "What are the symptoms of a hypertensive crisis?",
        "This is a dummy question not in the guidelines. Who won the superbowl?"
    ]
    
    print("--- Running Clinical RAG Evaluations ---\n")
    
    for i, query in enumerate(test_queries, 1):
        print(f"Test {i}: {query}")
        result = generate_answer(query)
        
        print(f"Answer: {result.get('answer')}")
        print(f"Sources: {result.get('sources')}")
        print(f"Reasoning: {result.get('reasoning')}")
        print("-" * 50 + "\n")

if __name__ == "__main__":
    run_evaluations()
