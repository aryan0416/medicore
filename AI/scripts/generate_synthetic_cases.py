import os
import random

# Target directory for the generated synthetic cases
OUTPUT_DIR = "data/raw_documents/clinical_cases"

# Sample clinical data for generation
ages = range(25, 85)
symptoms_list = [
    "chest pain, shortness of breath",
    "severe headache, blurry vision",
    "constant fatigue, increased thirst, frequent urination",
    "persistent cough, fever, night sweats",
    "joint pain, skin rash, fatigue",
    "dizziness, irregular heartbeat",
    "abdominal pain, nausea, vomiting"
]
bp_systolic = range(100, 200)
bp_diastolic = range(60, 120)

diagnoses = {
    "chest pain, shortness of breath": ["Acute Myocardial Infarction", "Pulmonary Embolism", "Stable Angina"],
    "severe headache, blurry vision": ["Hypertensive Crisis", "Migraine with Aura", "Idiopathic Intracranial Hypertension"],
    "constant fatigue, increased thirst, frequent urination": ["Type 2 Diabetes Mellitus", "Diabetes Insipidus"],
    "persistent cough, fever, night sweats": ["Tuberculosis", "Bacterial Pneumonia", "Lymphoma"],
    "joint pain, skin rash, fatigue": ["Systemic Lupus Erythematosus", "Rheumatoid Arthritis", "Lyme Disease"],
    "dizziness, irregular heartbeat": ["Atrial Fibrillation", "Orthostatic Hypotension"],
    "abdominal pain, nausea, vomiting": ["Acute Appendicitis", "Gastroenteritis", "Cholecystitis"]
}

treatments = {
    "Acute Myocardial Infarction": "Aspirin, Nitroglycerin, Heparin, Emergency PCI",
    "Pulmonary Embolism": "Anticoagulation therapy (e.g., Rivaroxaban), Oxygen support",
    "Stable Angina": "Beta-blockers, Statins, Sublingual nitroglycerin PRN",
    "Hypertensive Crisis": "IV Labetalol or Sodium Nitroprusside, Continuous BP monitoring",
    "Migraine with Aura": "Triptans, NSAIDs, Rest in a dark, quiet room",
    "Idiopathic Intracranial Hypertension": "Acetazolamide, Weight loss plan",
    "Type 2 Diabetes Mellitus": "Metformin, Dietary modifications, Blood glucose monitoring",
    "Diabetes Insipidus": "Desmopressin (DDAVP), Adequate hydration",
    "Tuberculosis": "6-month regimen of Isoniazid, Rifampin, Pyrazinamide, and Ethambutol",
    "Bacterial Pneumonia": "Oral Amoxicillin or Macrolides, Rest, Hydration",
    "Lymphoma": "Referral to oncology for chemotherapy/radiation evaluation",
    "Systemic Lupus Erythematosus": "Hydroxychloroquine, Corticosteroids during flares",
    "Rheumatoid Arthritis": "Methotrexate or other DMARDs, NSAIDs for pain",
    "Lyme Disease": "14-21 day course of Doxycycline",
    "Atrial Fibrillation": "Rate control (e.g., Metoprolol), Anticoagulation (e.g., Apixaban)",
    "Orthostatic Hypotension": "Increased fluid and salt intake, Fludrocortisone if refractory",
    "Acute Appendicitis": "Surgical appendectomy, Pre-operative IV antibiotics",
    "Gastroenteritis": "Oral rehydration therapy, Anti-emetics (e.g., Ondansetron)",
    "Cholecystitis": "Laparoscopic cholecystectomy, IV antibiotics"
}

outcomes = ["Stabilized and discharged", "Admitted for observation", "Referred to specialist", "Condition improving", "Requires follow-up in 2 weeks"]

def generate_cases(num_cases=50):
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    print(f"Generating {num_cases} synthetic clinical cases in {OUTPUT_DIR}...")
    
    for i in range(1, num_cases + 1):
        age = random.choice(ages)
        symptoms = random.choice(symptoms_list)
        sys_bp = random.choice(bp_systolic)
        dia_bp = random.choice(bp_diastolic)
        
        possible_diagnoses = diagnoses[symptoms]
        primary_diagnosis = random.choice(possible_diagnoses)
        
        treatment = treatments[primary_diagnosis]
        outcome = random.choice(outcomes)
        
        # Format the case as a clinical note
        case_text = f"""--- CLINICAL PATIENT RECORD ---
Case ID: SYN-{i:04d}
Date of Admission: 2023-11-15

Patient Profile:
Age: {age}
Sex: {random.choice(['Male', 'Female'])}
Vitals: BP {sys_bp}/{dia_bp} mmHg, HR {random.randint(60, 110)} bpm, Temp {round(random.uniform(97.5, 102.0), 1)} F

Presenting Symptoms:
{symptoms.capitalize()}

Assessment / Primary Diagnosis:
{primary_diagnosis}

Treatment Plan Administered:
{treatment}

Outcome / Status:
{outcome}
"""
        filename = f"synthetic_case_{i:03d}.txt"
        file_path = os.path.join(OUTPUT_DIR, filename)
        
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(case_text)
            
    print(f"✅ Successfully generated {num_cases} case files.")
    print("Run `python scripts/run_ingestion.py` to embed these into the AI Vector Store.")

if __name__ == "__main__":
    generate_cases()
