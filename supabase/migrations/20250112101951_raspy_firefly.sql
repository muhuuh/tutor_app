/*
  # Exercise Forge Tables

  1. New Tables
    - `exams`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `content` (text, not null) - Markdown content
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `teacher_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on `exams` table
    - Add policies for authenticated users to manage their own exams
*/

-- Create exams table
CREATE TABLE IF NOT EXISTS exams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  teacher_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Enable RLS
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;

-- Policies for exams table
CREATE POLICY "Teachers can view their own exams"
  ON exams
  FOR SELECT
  TO authenticated
  USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can insert their own exams"
  ON exams
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can update their own exams"
  ON exams
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = teacher_id)
  WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can delete their own exams"
  ON exams
  FOR DELETE
  TO authenticated
  USING (auth.uid() = teacher_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_exams_updated_at
  BEFORE UPDATE ON exams
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();