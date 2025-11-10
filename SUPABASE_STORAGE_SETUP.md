# Supabase Storage Setup for Executive Images

## Steps to Set Up Photo Upload Feature

### 1. Create Storage Bucket

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket**
4. Configure the bucket:
   - **Name**: `executive-photos`
   - **Public bucket**: ✅ **Check this** (so images can be accessed publicly)
   - **File size limit**: 20MB (or your preference)
   - **Allowed MIME types**: `image/*`
5. Click **Create bucket**

### 2. Set Up Row Level Security (RLS) Policies

After creating the bucket, you need to set up policies for secure access:

#### Policy 1: Allow Public Read Access
1. Go to **Storage** → **Policies** → `executive-photos`
2. Click **New Policy**
3. Choose **For full customization**, click **Next**
4. Configure:
   - **Policy name**: `Allow public read access`
   - **Allowed operation**: `SELECT`
   - **Target roles**: Select `anon` (or `public` if available)
   - **Apply policy to the selected roles**: ✅ Yes
   - **Policy definition**:
     ```sql
     (bucket_id = 'executive-photos')
     ```
5. Click **Review** → **Save policy**

#### Policy 2: Allow Authenticated Uploads
1. Click **New Policy** again
2. Choose **For full customization**, click **Next**
3. Configure:
   - **Policy name**: `Allow authenticated uploads`
   - **Allowed operation**: `INSERT`
   - **Target roles**: Select `authenticated`
   - **Apply policy to the selected roles**: ✅ Yes
   - **Policy definition**:
     ```sql
     (bucket_id = 'executive-photos' AND auth.role() = 'authenticated')
     ```
4. Click **Review** → **Save policy**

#### Policy 3: Allow Authenticated Updates
1. Click **New Policy** again
2. Choose **For full customization**, click **Next**
3. Configure:
   - **Policy name**: `Allow authenticated updates`
   - **Allowed operation**: `UPDATE`
   - **Target roles**: Select `authenticated`
   - **Apply policy to the selected roles**: ✅ Yes
   - **Policy definition**:
     ```sql
     (bucket_id = 'executive-photos' AND auth.role() = 'authenticated')
     ```
4. Click **Review** → **Save policy**

#### Policy 4: Allow Authenticated Deletes
1. Click **New Policy** again
2. Choose **For full customization**, click **Next**
3. Configure:
   - **Policy name**: `Allow authenticated deletes`
   - **Allowed operation**: `DELETE`
   - **Target roles**: Select `authenticated`
   - **Apply policy to the selected roles**: ✅ Yes
   - **Policy definition**:
     ```sql
     (bucket_id = 'executive-photos' AND auth.role() = 'authenticated')
     ```
4. Click **Review** → **Save policy**

### 3. Verify Setup

After setting up the bucket and policies:

1. Try uploading an image through the admin form
2. Check the Storage bucket to see if the file appears
3. Verify the image URL is accessible in the browser

### 4. File Structure

Files will be stored in the following structure:
```
executive-photos/
  └── executives/
      ├── exec-001-1234567890.jpg
      ├── exec-002-1234567891.png
      └── ...
```

### Troubleshooting

**Issue**: "Bucket does not exist" error
- **Solution**: Make sure the bucket name is exactly `executive-photos` (case-sensitive, lowercase with hyphen)

**Issue**: "Permission denied" error
- **Solution**: Check that RLS policies are correctly set up and that the user is authenticated

**Issue**: "File too large" error
- **Solution**: Check the bucket's file size limit in Supabase Storage settings

**Issue**: Images not displaying
- **Solution**: Ensure the bucket is set to **Public** and the public read policy is active

---

**Note**: The code is already implemented and ready to use once you complete these steps!

