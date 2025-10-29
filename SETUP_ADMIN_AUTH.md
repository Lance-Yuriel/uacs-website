# Admin Authentication Setup Guide

## External Steps You Need to Do:

### Step 1: Enable Authentication in Supabase

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/vhilgopwzlaalqdonkgo/auth/providers)
2. Click **Authentication** in the left sidebar
3. Click **Providers** submenu
4. Enable **Email** provider if not already enabled
   - This allows email/password authentication

### Step 2: Create Admin User

1. Still in the Authentication section, click **Users** in the left sidebar
2. Click **Add user** button
3. Fill in:
   - **Email**: Your email address (this will be your admin login)
   - **Password**: Create a strong password
   - **Auto Confirm User**: ✅ Check this box (allows immediate login)
4. Click **Create user**

### Step 3: Optional - Send Magic Link Instead

If you prefer passwordless authentication:

1. Go to **Providers** → **Email**
2. Enable "Enable Email Signup"
3. Use "Send a magic link" option when signing in

That's it! The admin authentication system will work with your created user.

## What Gets Created:

- `/admin/login` - Admin login page
- Session management - Stay logged in across browser sessions
- Protected routes - Only accessible when logged in
- Admin context - Detect when you're logged in as admin

## Notes:

- Your password is secure - Supabase hashes it automatically
- No need to create user signup forms - we only need one admin
- You can create more admins later if needed
