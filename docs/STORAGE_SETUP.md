# Storage Setup for Business Images

This document explains the storage configuration for business images.

## Current Setup (Working)

The application is currently configured to use the existing `brand-logos` bucket with a `businesses/` folder structure. This provides immediate functionality without requiring additional bucket creation.

### Current Configuration:
- **Bucket**: `brand-logos` (existing)
- **Folder**: `businesses/` (for business images)
- **File naming**: `business-{businessId}-{randomString}.{extension}`
- **Public access**: ✅ Enabled
- **File size limit**: `5 MB`
- **Allowed MIME types**: PNG, JPG, JPEG, GIF, WebP

## Optional: Create Dedicated Bucket

If you want to create a separate `business-images` bucket for better organization:

### 1. Create the Storage Bucket

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Navigate to your project: `motoselectricas.co@protonmail.com's Project`
3. Go to **Storage** in the left sidebar
4. Click **New bucket**
5. Configure the bucket:
   - **Name**: `business-images`
   - **Public bucket**: ✅ Enabled (so images can be accessed publicly)
   - **File size limit**: `5 MB`
   - **Allowed MIME types**:
     - `image/png`
     - `image/jpeg`
     - `image/jpg`
     - `image/gif`
     - `image/webp`

### 2. Set Up Row Level Security (RLS) Policies

After creating the bucket, you need to set up policies to control access:

1. Go to **Authentication** > **Policies** in your Supabase dashboard
2. Find the `storage.objects` table
3. Add the following policies:

#### Policy 1: Allow Public Read Access
```sql
CREATE POLICY "Allow public read access to business images" ON storage.objects
FOR SELECT USING (bucket_id = 'business-images');
```

#### Policy 2: Allow Authenticated Upload
```sql
CREATE POLICY "Allow authenticated users to upload business images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'business-images' AND
  auth.role() = 'authenticated'
);
```

#### Policy 3: Allow Authenticated Update
```sql
CREATE POLICY "Allow authenticated users to update business images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'business-images' AND
  auth.role() = 'authenticated'
);
```

#### Policy 4: Allow Authenticated Delete
```sql
CREATE POLICY "Allow authenticated users to delete business images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'business-images' AND
  auth.role() = 'authenticated'
);
```

## How It Works

The application uploads business images to:

- **Bucket**: `brand-logos` (shared with brand logos)
- **Path**: `businesses/business-{businessId}-{randomString}.{extension}`
- **Access**: Public URLs for website display

This approach provides immediate functionality using existing infrastructure.

## Testing the Setup

1. Navigate to `/admin/businesses/[id]` in your application
2. Try uploading an image using the drag-and-drop component
3. Verify the image appears in the preview
4. Check that the image URL is saved to the database
5. Confirm the image is publicly accessible via the generated URL

## File Organization

Images are stored with the following naming convention:
```
businesses/business-{businessId}-{randomString}.{extension}
```

Example:
```
businesses/business-9-abc123def.jpg
```

## Troubleshooting

### Upload Fails with "Bucket not found"
- Verify the `business-images` bucket exists in your Supabase dashboard
- Check that the bucket name is exactly `business-images` (case-sensitive)

### Upload Succeeds but Image Not Visible
- Ensure the bucket is set to **Public**
- Verify the "Allow public read access" policy is active

### Authentication Errors
- Check that the user is properly authenticated
- Verify the upload policies are correctly configured

### File Type Rejected
- Confirm the file type is in the allowed MIME types list
- Check the file size is under 5MB

## Security Considerations

- The bucket is public for read access to allow images to be displayed on the website
- Only authenticated users can upload, update, or delete images
- File size is limited to 5MB to prevent abuse
- Only image file types are allowed

## Future Improvements

Consider implementing:
- Image optimization/compression before upload
- Automatic thumbnail generation
- CDN integration for better performance
- Image metadata extraction and storage
