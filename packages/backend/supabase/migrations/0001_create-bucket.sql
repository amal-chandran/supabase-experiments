-- Create storage bucket for post cover images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'post-covers',
  'post-covers',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
);

-- Policy: Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload cover images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'post-covers' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Allow anyone to read/view cover images
CREATE POLICY "Anyone can view cover images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'post-covers');

-- Policy: Allow authenticated users to update their own files
CREATE POLICY "Authenticated users can update their own cover images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'post-covers' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Allow authenticated users to delete their own files
CREATE POLICY "Authenticated users can delete their own cover images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'post-covers' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
