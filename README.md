# 🏥 Healthcare Platform + Clinical AI System

This repository contains a **full-stack hospital management platform** integrated with an **AI-powered clinical knowledge system** built using Retrieval-Augmented Generation (RAG).

The project is designed for a **200-bed hospital setup**, combining modern web infrastructure with clinical decision-support AI.

---

# 📦 Repository Overview

This repository contains **two primary systems**:

| System                           | Purpose                                                                                      |
| -------------------------------- | -------------------------------------------------------------------------------------------- |
| **Hospital Management Platform** | Core operational system for managing patients, beds, labs, billing, and hospital workflows   |
| **AI Clinical RAG Service**      | AI-powered assistant that retrieves medical knowledge from guidelines and clinical documents |

---

# 🏗 High-Level Architecture

```
                Doctor / Staff
                      │
                      ▼
            Hospital Web Platform
         (Next.js + Express Backend)
                      │
                      ▼
               Clinical API Layer
                      │
                      ▼
             AI Clinical RAG Service
           (FastAPI + Vector Database)
                      │
                      ▼
         Clinical Guidelines + Research
```

The AI system **never guesses answers**.
Instead it retrieves medical evidence from trusted documents and generates responses based on those sources.

---

# 🧱 Tech Stack

## Frontend

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* React Query

## Backend

* Express.js
* TypeScript
* Drizzle ORM
* Supabase (PostgreSQL)

## Authentication

* Supabase Auth
* JWT-based authentication
* Role-Based Access Control (RBAC)

## AI System

* FastAPI
* Retrieval-Augmented Generation (RAG)
* Vector Database
* OpenAI / HuggingFace models
* Clinical document retrieval pipeline

---

# 📁 Project Structure

```
healthcare-project/
│
├── AI/                    # Clinical AI RAG service
│
├── hospital-app-main/     # Core hospital management platform
│
├── .gitignore
└── README.md
```

---

# 🏥 Hospital Management Platform

Location:

```
hospital-app-main/
```

Enterprise-grade hospital system with the following modules:

### Core Modules

* Patient Management
* Encounter / Clinical Records
* Bed Management
* Lab Management
* Pharmacy & Inventory
* Billing & Invoicing
* Reports & Analytics
* Activity Logs
* Admin Settings

### Security Architecture

* Supabase handles authentication
* Backend verifies JWT tokens
* RBAC middleware enforces permissions
* Critical actions logged in `activity_logs`

### Development Setup

Install dependencies:

```
pnpm install
```

Create environment file:

```
cp .env.example .env
```

Run backend:

```
cd apps/backend
pnpm dev
```

Run frontend:

```
cd apps/frontend
pnpm dev
```

---

# 🤖 AI Clinical RAG Service

Location:

```
AI/
```

This service provides **evidence-based medical question answering** using Retrieval-Augmented Generation.

The system retrieves information from clinical documents before generating responses.

### Key Capabilities

* Medical guideline retrieval
* Evidence-based answers
* Hallucination prevention
* Source citation
* Similar case retrieval

### AI Pipeline

```
Clinical Documents
      │
      ▼
Document Ingestion
      │
      ▼
Text Chunking
      │
      ▼
Embeddings Generation
      │
      ▼
Vector Database
      │
      ▼
Retriever
      │
      ▼
RAG Generation Pipeline
      │
      ▼
Evidence-Based Answer
```

### Setup

Navigate to the AI service:

```
cd AI
```

Create virtual environment:

```
python -m venv venv
source venv/bin/activate
```

Install dependencies:

```
pip install -r requirements.txt
```

Create `.env` file:

```
OPENAI_API_KEY=your_key
```

Add medical documents:

```
AI/data/raw_documents/
```

Run ingestion pipeline:

```
python scripts/run_ingestion.py
```

Start the AI server:

```
uvicorn app.main:app
```

---

# 🔌 API Example

Endpoint:

```
POST /chat
```

Example request:

```
{
  "query": "What is the recommended treatment for hypertension stage 2?"
}
```

Example response:

```
{
  "answer": "...",
  "sources": ["hypertension_guidelines.pdf"],
  "reasoning": "Generated using clinical RAG pipeline."
}
```

---

# ⚠️ Medical Disclaimer

This system provides **clinical decision support only**.

It does **not replace licensed medical professionals**.
All clinical decisions must be made by qualified healthcare providers.

---

# 📄 License

Private enterprise software.
