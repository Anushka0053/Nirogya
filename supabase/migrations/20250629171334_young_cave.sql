/*
  # Add User Settings Table

  1. New Tables
    - `user_settings` - User preferences and settings

  2. Security
    - Enable RLS on the table
    - Add policies for authenticated users to manage their own settings
*/

-- User Settings Table
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL UNIQUE,
  notifications_enabled boolean DEFAULT true,
  medicine_reminders boolean DEFAULT true,
  appointment_reminders boolean DEFAULT true,
  health_tips boolean DEFAULT true,
  emergency_alerts boolean DEFAULT true,
  data_sharing boolean DEFAULT false,
  analytics_tracking boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_settings
CREATE POLICY "Users can manage own settings"
  ON user_settings FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);