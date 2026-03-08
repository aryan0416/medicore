import os
from supabase import create_client, Client
from app.config import SUPABASE_URL, SUPABASE_KEY

def get_supabase_client() -> Client:
    """
    Initializes and returns the Supabase client.
    """
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("Warning: Supabase URL or Key is missing. Real-time features will be disabled.")
        return None
        
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        return supabase
    except Exception as e:
        print(f"Failed to initialize Supabase client: {e}")
        return None

def fetch_patient_history(patient_id: str) -> str:
    """
    Fetches real-time patient data from Supabase.
    You can customize the table name and select fields based on the fullstack schema.
    """
    supabase = get_supabase_client()
    if not supabase:
        return ""
        
    try:
        # Example schema: table 'patients' with columns 'symptoms', 'history', 'vitals'
        # Fullstack developer must ensure this table/query matches their exact database schema.
        response = supabase.table("patients").select("*").eq("id", patient_id).execute()
        
        data = response.data
        if not data:
            return f"No real-time data found for patient ID: {patient_id}."
            
        patient = data[0]
        
        # Build a readable string from the database row
        realtime_context = []
        for key, value in patient.items():
            if key not in ['id', 'created_at'] and value:
                realtime_context.append(f"{key.capitalize()}: {value}")
                
        return "\n".join(realtime_context)
        
    except Exception as e:
        print(f"Error fetching real-time data from Supabase: {e}")
        return f"System currently unable to retrieve patient {patient_id}'s real-time data."
