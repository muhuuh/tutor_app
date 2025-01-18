/*
  # Enable RLS for chat history table

  1. Security Changes
    - Enable RLS on chat_history table
    - Add policies for authenticated users to:
      - Select their own chat history
      - Insert their own chat messages
      - Update their own chat messages
      - Delete their own chat messages
*/

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