/*
  # Nirogya Health Assistant Database Schema

  1. New Tables
    - `user_profiles` - Extended user profile information
    - `health_records` - General health activity tracking
    - `symptom_checks` - Symptom checker results and recommendations
    - `pulse_readings` - Heart rate monitoring data
    - `medical_images` - Medical image analysis results
    - `doctor_consultations` - Doctor visit records
    - `emergency_contacts` - User emergency contact information

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Secure access patterns for health data

  3. Features
    - Comprehensive health tracking
    - Medical history storage
    - Emergency contact management
    - Activity timeline
*/

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid REFERENCES auth.users(id) PRIMARY KEY,
  full_name text NOT NULL,
  age integer,
  gender text CHECK (gender IN ('male', 'female', 'other')),
  blood_group text,
  location text,
  phone text,
  emergency_contact_name text,
  emergency_contact_phone text,
  medical_conditions text[],
  allergies text[],
  current_medications text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Health Records Table (General activity tracking)
CREATE TABLE IF NOT EXISTS health_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  activity_type text NOT NULL CHECK (activity_type IN ('symptom_check', 'pulse_reading', 'image_analysis', 'doctor_visit', 'emergency_alert')),
  title text NOT NULL,
  description text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Symptom Checks Table
CREATE TABLE IF NOT EXISTS symptom_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  symptoms text[] NOT NULL,
  recommended_medicines jsonb DEFAULT '[]',
  severity_level text CHECK (severity_level IN ('mild', 'moderate', 'severe')) DEFAULT 'mild',
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Pulse Readings Table
CREATE TABLE IF NOT EXISTS pulse_readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  heart_rate integer NOT NULL CHECK (heart_rate > 0 AND heart_rate < 300),
  status text CHECK (status IN ('low', 'normal', 'high')) DEFAULT 'normal',
  notes text,
  recorded_at timestamptz DEFAULT now()
);

-- Medical Images Table
CREATE TABLE IF NOT EXISTS medical_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  image_url text,
  image_type text CHECK (image_type IN ('xray', 'ct_scan', 'mri', 'wound', 'skin', 'other')),
  analysis_result jsonb DEFAULT '{}',
  confidence_score decimal(3,2),
  recommended_action text,
  created_at timestamptz DEFAULT now()
);

-- Doctor Consultations Table
CREATE TABLE IF NOT EXISTS doctor_consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  doctor_name text NOT NULL,
  specialization text NOT NULL,
  hospital_name text,
  consultation_date timestamptz DEFAULT now(),
  diagnosis text,
  prescribed_medications text[],
  follow_up_date timestamptz,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Emergency Contacts Table
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  name text NOT NULL,
  relationship text NOT NULL,
  phone text NOT NULL,
  email text,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptom_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulse_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for health_records
CREATE POLICY "Users can view own health records"
  ON health_records FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health records"
  ON health_records FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own health records"
  ON health_records FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for symptom_checks
CREATE POLICY "Users can manage own symptom checks"
  ON symptom_checks FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for pulse_readings
CREATE POLICY "Users can manage own pulse readings"
  ON pulse_readings FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for medical_images
CREATE POLICY "Users can manage own medical images"
  ON medical_images FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for doctor_consultations
CREATE POLICY "Users can manage own consultations"
  ON doctor_consultations FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for emergency_contacts
CREATE POLICY "Users can manage own emergency contacts"
  ON emergency_contacts FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_health_records_user_id ON health_records(user_id);
CREATE INDEX IF NOT EXISTS idx_health_records_created_at ON health_records(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_symptom_checks_user_id ON symptom_checks(user_id);
CREATE INDEX IF NOT EXISTS idx_pulse_readings_user_id ON pulse_readings(user_id);
CREATE INDEX IF NOT EXISTS idx_medical_images_user_id ON medical_images(user_id);
CREATE INDEX IF NOT EXISTS idx_doctor_consultations_user_id ON doctor_consultations(user_id);
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_user_id ON emergency_contacts(user_id);