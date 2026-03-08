import os
from pathlib import Path
from langchain_community.document_loaders import PyPDFLoader, TextLoader, Docx2txtLoader, CSVLoader
from langchain_core.documents import Document
def load_document(file_path: str):
    ext = Path(file_path).suffix.lower()
    if ext == ".pdf":
        loader = PyPDFLoader(file_path)
    elif ext == ".txt":
        loader = TextLoader(file_path)
    elif ext == ".docx":
        loader = Docx2txtLoader(file_path)
    elif ext == ".csv":
        loader = CSVLoader(file_path=file_path)
    else:
        print(f"Unsupported file format: {ext} for file {file_path}")
        return []
    
    try:
        return loader.load()
    except Exception as e:
        print(f"Error loading {file_path}: {e}")
        return []

def load_all_documents(directory_path: str):
    all_documents = []
    
    if not os.path.exists(directory_path):
        os.makedirs(directory_path, exist_ok=True)
        print(f"Created directory {directory_path}. Please add documents.")
        return all_documents

    for root, _, files in os.walk(directory_path):
        for file in files:
            file_path = os.path.join(root, file)
            print(f"Loading document: {file_path}")
            docs = load_document(file_path)
            all_documents.extend(docs)
            
    print(f"Loaded {len(all_documents)} total document pages/sections.")
    return all_documents
