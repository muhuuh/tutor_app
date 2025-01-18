/*
  # Create storage bucket for assignments

  1. Storage
    - Create 'assignments' bucket for storing student work images
  2. Security
    - Enable public access for authenticated users
*/

-- Create bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('assignments', 'assignments', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'assignments');

-- Allow authenticated users to read files
CREATE POLICY "Authenticated users can read files"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'assignments');