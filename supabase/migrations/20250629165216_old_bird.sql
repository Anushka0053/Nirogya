/*
  # Add Medicine Reminders and Appointments Tables

  1. New Tables
    - `medicine_reminders` - Medicine reminder management
    - `appointments` - Doctor appointment booking and management

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data

  3. Features
    - Medicine reminder scheduling with time slots
    - Doctor appointment booking with status tracking
*/

-- Medicine Reminders Table
CREATE TABLE IF NOT EXISTS medicine_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  medicine_name text NOT NULL,
  dosage text NOT NULL,
  frequency text NOT NULL CHECK (frequency IN ('daily', 'twice_daily', 'three_times', 'weekly', 'as_needed')),
  time_slots text[] NOT NULL,
  start_date date NOT NULL,
  end_date date,
  notes text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  doctor_name text NOT NULL,
  specialization text NOT NULL,
  hospital_name text NOT NULL,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  reason text NOT NULL,
  status text CHECK (status IN ('scheduled', 'completed', 'cancelled')) DEFAULT 'scheduled',
  doctor_phone text,
  address text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE medicine_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for medicine_reminders
CREATE POLICY "Users can manage own medicine reminders"
  ON medicine_reminders FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for appointments
CREATE POLICY "Users can manage own appointments"
  ON appointments FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_medicine_reminders_user_id ON medicine_reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_medicine_reminders_active ON medicine_reminders(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(user_id, appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(user_id, status);