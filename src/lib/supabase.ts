import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface UserProfile {
  id: string;
  full_name: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  blood_group?: string;
  location?: string;
  phone?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  medical_conditions?: string[];
  allergies?: string[];
  current_medications?: string[];
  created_at: string;
  updated_at: string;
}

export interface HealthRecord {
  id: string;
  user_id: string;
  activity_type: 'symptom_check' | 'pulse_reading' | 'image_analysis' | 'doctor_visit' | 'emergency_alert';
  title: string;
  description?: string;
  metadata: any;
  created_at: string;
}

export interface SymptomCheck {
  id: string;
  user_id: string;
  symptoms: string[];
  recommended_medicines: any[];
  severity_level: 'mild' | 'moderate' | 'severe';
  notes?: string;
  created_at: string;
}

export interface PulseReading {
  id: string;
  user_id: string;
  heart_rate: number;
  status: 'low' | 'normal' | 'high';
  notes?: string;
  recorded_at: string;
}