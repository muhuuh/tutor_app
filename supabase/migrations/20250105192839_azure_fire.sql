/*
  # Initial Schema Setup

  1. New Tables
    - `reports`
      - `id` (uuid, primary key)
      - `report` (text)
      - `teacher_id` (uuid, foreign key)
      - `requested_at` (timestamp)
      - `pupil_id` (uuid, foreign key)
    
    - `pupils`
      - `id` (uuid, primary key)
      - `name` (text)
      - `pupil_level` (text)
      - `analysis` (text)

  2. Security
    - Enable RLS on all tables
    - Add policies for teachers to manage their pupils and reports
*/

-- Create pupils table
CREATE TABLE IF NOT EXISTS pupils (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  pupil_level text NOT NULL,
  analysis text,
  created_at timestamptz DEFAULT now(),
  teacher_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report text NOT NULL,
  teacher_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  requested_at timestamptz DEFAULT now(),
  pupil_id uuid REFERENCES pupils(id) ON DELETE CASCADE NOT NULL
);

-- Enable Row Level Security
ALTER TABLE pupils ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Policies for pupils table
CREATE POLICY "Teachers can view their own pupils"
  ON pupils
  FOR SELECT
  TO authenticated
  USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can insert their own pupils"
  ON pupils
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can update their own pupils"
  ON pupils
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = teacher_id)
  WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can delete their own pupils"
  ON pupils
  FOR DELETE
  TO authenticated
  USING (auth.uid() = teacher_id);

-- Policies for reports table
CREATE POLICY "Teachers can view their own reports"
  ON reports
  FOR SELECT
  TO authenticated
  USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can insert their own reports"
  ON reports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can update their own reports"
  ON reports
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = teacher_id)
  WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can delete their own reports"
  ON reports
  FOR DELETE
  TO authenticated
  USING (auth.uid() = teacher_id);