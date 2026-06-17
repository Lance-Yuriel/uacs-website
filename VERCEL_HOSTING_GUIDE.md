# Vercel Hosting Guide for UACS Website

This guide provides step-by-step instructions for deploying the UACS Website to Vercel. It includes context for AI assistants (like Antigravity) to help with the deployment process.

## Project Overview

The UACS Website is a Next.js 15 App Router application for the University of Auckland Calisthenics Society. It features:

- **Public-facing website**: Marketing site with hero section, events display, and member counter
- **Admin dashboard**: Authenticated Firebase-based management system for events
- **Backend**: Firebase (Cloud Firestore, Auth) + Google Sheets API for member count
- **Tech Stack**: Next.js 15.5.6, TypeScript, Tailwind CSS 4, Framer Motion, Firebase SDK

## Branch Merging Recommendation

**Recommendation: Merge branches AFTER completing remaining features, but BEFORE Vercel deployment.**

### Current Branch Status

You have multiple feature branches:
- `feature/ui-enhancements` (current branch) - Contains latest UI improvements, button animations, spacing fixes, and Firebase integration.
- `feature/event-enhancements` - Event photo URLs, separate descriptions
- `feature/documentation-updates` - Documentation improvements
- `feature/admin-authentication` - Admin auth system
- `feature/supabase-schema` - Legacy database schema reference

### Recommended Workflow

1. **Continue working on remaining features** in Antigravity using your current branch (`feature/ui-enhancements`) or create new feature branches.
2. **Complete all remaining features** (mobile responsiveness, animations, redesigns, etc.).
3. **Before Vercel deployment**: Merge all feature branches into `main` branch.
4. **Deploy from `main`** to Vercel.

**Why this approach?**
- Keeps your feature work organized and testable.
- Allows you to deploy a complete, tested version.
- Easier to troubleshoot if issues arise during deployment.
- Cleaner git history for production.

### Merging Process (When Ready)

```bash
# Switch to main branch
git checkout main
git pull origin main

# Merge feature branches one by one
git merge feature/ui-enhancements
git merge feature/event-enhancements
git merge feature/documentation-updates
# ... merge other branches as needed

# Push to GitHub
git push origin main
```

## Vercel Deployment Steps

### Prerequisites

1. **GitHub Repository**: Your code must be pushed to GitHub.
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com) (free tier is sufficient).
3. **Environment Variables**: Have all required environment variables ready (see below).

### Step 1: Prepare Your Code

1. **Ensure all changes are committed and pushed to GitHub**
   ```bash
   git status
   git add .
   git commit -m "Final changes before deployment"
   git push origin main
   ```

2. **Test build locally**
   ```bash
   npm run build
   ```
   If the build fails, fix issues before proceeding.

### Step 2: Create Vercel Account & Project

#### 2.1 Sign Up for Vercel (Free Tier)

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub (recommended) or email.
3. The free tier includes:
   - Unlimited personal projects
   - 100GB bandwidth/month
   - Automatic HTTPS
   - Custom domains (free)
   - Serverless functions
   - Edge Network

#### 2.2 Import Your Project

1. After signing in, click **"Add New..."** → **"Project"**
2. Import your GitHub repository.
3. Vercel will detect it's a Next.js project automatically.

### Step 3: Configure Project Settings

#### 3.1 Project Configuration

- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `./` (root of repository)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

#### 3.2 Environment Variables

**CRITICAL**: Add all environment variables in Vercel dashboard before first deployment.

Go to **Settings** → **Environment Variables** and add:

##### Firebase Client Variables (Required)
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

**Where to find these:**
- Go to your Firebase project dashboard.
- Settings (Gear Icon) → Project Settings.
- Scroll down to "Your apps" section and copy the configuration values.

##### Google Sheets / Firebase Admin Variables (Required)
```
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour key\n-----END PRIVATE KEY-----\n"
```

**Important Notes:**
- The `GOOGLE_PRIVATE_KEY` must include the `\n` characters (newlines) in the string.
- Wrap the entire key in quotes.
- In Vercel, paste the key exactly as it appears in your `.env.local`.
- The Admin SDK will automatically fall back to using `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_PRIVATE_KEY` for service account credentials, meaning you do not need separate `FIREBASE_CLIENT_EMAIL` or `FIREBASE_PRIVATE_KEY` in production unless you choose to define them.

#### 3.3 Set Environment for Variables

For each variable, select:
- **Production** ✅
- **Preview** ✅ (optional, for testing)
- **Development** (optional)

### Step 4: Deploy

1. Click **"Deploy"** button.
2. Vercel will:
   - Install dependencies
   - Run build command
   - Deploy to production
3. First deployment takes 2-5 minutes.

### Step 5: Verify Deployment

1. **Check Build Logs**
   - Look for any errors or warnings.
   - Common issues: missing environment variables, build errors.

2. **Test Your Site**
   - Visit the provided Vercel URL (e.g., `your-project.vercel.app`).
   - Test public pages.
   - Test admin login.
   - Test member counter.
   - Test events display.

3. **Check Function Logs**
   - Go to **Deployments** → Click on your deployment → **Functions** tab.
   - Check for any runtime errors.

### Step 6: Custom Domain (Optional)

1. Go to **Settings** → **Domains**.
2. Add your custom domain.
3. Follow DNS configuration instructions.
4. Vercel automatically provisions SSL certificate.

## Troubleshooting

### Build Fails

**Common causes:**
- Missing environment variables.
- TypeScript errors.
- Import errors.
- Missing dependencies.

**Solution:**
- Check build logs in Vercel dashboard.
- Test build locally: `npm run build`.
- Fix errors and push again.

### Environment Variables Not Working

**Symptoms:**
- API calls fail.
- Firebase connection errors.
- Google Sheets errors.

**Solution:**
- Verify all variables are set in Vercel dashboard.
- Check variable names match exactly (case-sensitive).
- Ensure `NEXT_PUBLIC_` prefix for client-side variables.
- Redeploy after adding variables.

### Runtime Errors

**Check:**
- Function logs in Vercel dashboard.
- Browser console for client-side errors.
- Network tab for API call failures.

### Member Counter Not Working

**Check:**
- Google Sheets environment variables are set correctly.
- Service account has access to the spreadsheet.
- Spreadsheet ID is correct.
- Private key includes `\n` characters.

### Admin Authentication Not Working

**Check:**
- Firebase environment variables are correct.
- Email/Password auth is enabled in Firebase Console.
- Admin user account is created in Firebase Auth.

## Cost Information

**Vercel Free Tier Includes:**
- Unlimited personal projects
- 100GB bandwidth/month
- Automatic HTTPS
- Serverless functions
- Edge Network
- Custom domains

**Firebase Free Tier (Spark Plan) Includes:**
- **Firestore**: 1 GiB total storage, 50,000 reads/day, 20,000 writes/day, 20,000 deletes/day
- **Authentication**: 50,000 monthly active users for free

**Google Sheets API:**
- Free (within quotas)
- 100 requests per 100 seconds per user

**Total Cost: $0/month** (for typical usage)

## Important Notes for AI Assistants

### Project Structure
- Next.js 15 App Router with TypeScript.
- Firebase for backend (Cloud Firestore, Authentication).
- Google Sheets API for member count.
- Framer Motion for animations.
- Tailwind CSS 4 for styling.

### Key Files
- `src/app/api/` - API routes (Next.js serverless functions)
- `src/app/admin/` - Admin pages (protected by middleware redirect checks)
- `src/components/` - React components
- `src/lib/` - Utility functions, Firebase clients, Google Sheets helpers
- `src/contexts/AuthContext.tsx` - Admin Auth Context Provider

### Environment Variables
- All `NEXT_PUBLIC_*` variables are exposed to the browser.
- Server-only variables (Google Sheets, service keys) are not exposed.
- Vercel automatically injects environment variables at build time.

### Deployment Process
- Vercel builds the project on each push to `main` branch.
- Preview deployments are created for pull requests.
- Environment variables must be set in Vercel dashboard.
- Build logs are available in Vercel dashboard.

---

**Last Updated**: After Firebase migration
**Status**: Ready for deployment after branch merge
