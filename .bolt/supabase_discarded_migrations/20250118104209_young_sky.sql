/*
  # Add chat history table

  1. New Tables
    - `chat_history`
      - `id` (uuid, primary key)
      - `content` (text, message content)
      - `is_user` (boolean, whether message is from user)
      - `pupil_id` (uuid, reference to pupils table)
      - `teacher_id` (uuid, reference to auth.users table)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `chat_history` table
    - Add policies for authenticated users to manage their own chat history
*/

-- Create chat history table
CREATE TABLE IF NOT EXISTS chat_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  is_user boolean NOT NULL DEFAULT false,
  pupil_id uuid REFERENCES pupils(id) ON DELETE CASCADE NOT NULL,
  teacher_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- Policies for chat_history table
CREATE POLICY "Teachers can view their own chat history"
  ON chat_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can insert their own chat messages"
  ON chat_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can update their own chat messages"
  ON chat_history
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = teacher_id)
  WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can delete their own chat messages"
  ON chat_history
  FOR DELETE
  TO authenticated
  USING (auth.uid() = teacher_id);

-- Create index for faster queries
CREATE INDEX chat_history_pupil_id_idx ON chat_history(pupil_id);
CREATE INDEX chat_history_teacher_id_idx ON chat_history(teacher_id);