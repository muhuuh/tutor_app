/*
  # Add corrections table

  1. New Tables
    - `corrections`
      - `id` (uuid, primary key)
      - `content` (text, the correction content in markdown)
      - `exam_id` (uuid, reference to exams table)
      - `teacher_id` (uuid, reference to auth.users)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `corrections` table
    - Add policies for authenticated users to manage their own corrections
*/

-- Create corrections table
CREATE TABLE IF NOT EXISTS corrections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  exam_id uuid REFERENCES exams(id) ON DELETE CASCADE NOT NULL,
  teacher_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE corrections ENABLE ROW LEVEL SECURITY;

-- Policies for corrections table
CREATE POLICY "Teachers can view their own corrections"
  ON corrections
  FOR SELECT
  TO authenticated
  USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can insert their own corrections"
  ON corrections
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can update their own corrections"
  ON corrections
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = teacher_id)
  WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can delete their own corrections"
  ON corrections
  FOR DELETE
  TO authenticated
  USING (auth.uid() = teacher_id);

-- Function to update updated_at timestamp
CREATE TRIGGER update_corrections_updated_at
  BEFORE UPDATE ON corrections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();