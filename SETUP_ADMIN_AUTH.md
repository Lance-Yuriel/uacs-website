# Admin Authentication Setup Guide

This guide describes how to configure the authentication backend for UACS Website admins.

## External Steps You Need to Do:

### Step 1: Enable Authentication in Firebase Console

1. Go to your [Firebase Console](https://console.firebase.google.com/).
2. Select your project **`uacs-website`** (Project ID: `uacs-website-fe051`).
3. Click on **Authentication** in the left sidebar under the "Build" menu.
4. Go to the **Sign-in method** tab.
5. Click **Add new provider**, select **Email/Password**, enable it, and click **Save**.
   - This allows admin login via email and password.

### Step 2: Create Admin User

1. In the **Authentication** section, click on the **Users** tab.
2. Click the **Add user** button in the top right.
3. Fill in:
   - **Email**: Your email address (this will be your admin login).
   - **Password**: Create a strong, secure password.
4. Click **Add user**.

That's it! The admin authentication system will now work with the created user credentials.

## What Gets Created:

- `/admin/login` - Admin login page where users enter their email and password.
- **Session management** - Handled securely by Firebase Client SDK (persistence across page refreshes and browser sessions).
- **Protected routes** - Pages under `/admin` are protected by checking token verification.
- **Admin context** - `AuthContext` provides stateful access to user object and active admin sessions in React.

## Security & Best Practices:

- Firebase securely hashes and stores passwords on their infrastructure.
- There is no custom user signup page — we only need defined admins created manually via the Firebase Console.
- You can add additional administrators at any time by repeating Step 2 in the Firebase Console.
