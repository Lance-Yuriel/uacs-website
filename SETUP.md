# UACS Website - Secure Setup & Deployment Guide

## 🔒 Security First

**CRITICAL**: Never commit sensitive information to version control!

### Files to NEVER commit:
- `.env.local` (environment variables)
- `google-credentials.json` (service account keys)
- Any file containing API keys or secrets

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   ```
   http://localhost:3000
   ```

## 📊 Google Sheets API Setup (Optional)

To enable the real-time member counter, you need to set up Google Sheets API:

### Step 1: Google Cloud Console Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project: "UACS Website"
3. Enable Google Sheets API
4. Create Service Account:
   - IAM & Admin → Service Accounts → Create Service Account
   - Name: "uacs-website-service"
   - Role: None needed (we'll share sheet directly)
   - Create key → JSON format → Download
   - **SECURITY**: Keep this file secure and never commit it to version control

### Step 2: Prepare Google Sheet
1. Your existing members spreadsheet
2. Share sheet with service account email (found in JSON key file)
3. Give "Viewer" access
4. Note the Spreadsheet ID from URL

### Step 3: Environment Variables
Create `.env.local` file in project root:
```env
# Google Sheets API Configuration
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour key here\n-----END PRIVATE KEY-----\n"

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="University of Auckland Calisthenics Society"
```

## 🚀 Vercel Deployment

### Prerequisites
- GitHub account
- Vercel account
- All environment variables ready

### Step 1: Prepare for GitHub
1. Ensure `.env.local` is in `.gitignore`
2. Commit your code:
   ```bash
   git add .
   git commit -m "Initial commit: UACS website"
   ```

### Step 2: Push to GitHub
1. Create a new repository on GitHub
2. Push your code:
   ```bash
   git remote add origin https://github.com/yourusername/uacs-website.git
   git branch -M main
   git push -u origin main
   ```

### Step 3: Deploy to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables:
   - `GOOGLE_SHEETS_SPREADSHEET_ID`
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`
5. Deploy!

### Step 4: Custom Domain (Optional)
1. In Vercel dashboard, go to your project
2. Settings → Domains
3. Add your custom domain
4. Update DNS records as instructed

## 🛡️ Security Best Practices

### Environment Variables
- ✅ Use `.env.local` for local development
- ✅ Set environment variables in Vercel dashboard
- ❌ Never commit `.env.local` to version control
- ❌ Never hardcode secrets in source code

### Service Account Security
- ✅ Use least privilege (Viewer access only)
- ✅ Rotate keys regularly in production
- ✅ Monitor API usage in Google Cloud Console
- ❌ Never share service account keys

### Code Security
- ✅ Use TypeScript for type safety
- ✅ Validate all inputs
- ✅ Handle errors gracefully
- ✅ Use HTTPS in production

## 🎨 Design System

The website uses an Aurora-inspired design system with:
- **Dark theme** with purple accent colors
- **Glassmorphism effects** with backdrop blur
- **Responsive design** (mobile-first)
- **Smooth animations** with Framer Motion

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Main homepage
│   ├── layout.tsx         # Root layout with navbar/footer
│   ├── globals.css        # Global styles
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── layout/           # Layout components (Navbar, Footer)
│   ├── home/             # Homepage sections
│   ├── executives/       # Executive team components
│   └── events/           # Events gallery components
├── data/                 # JSON data files
├── lib/                  # Utility functions
├── types/                # TypeScript interfaces
└── hooks/                # Custom React hooks
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📝 Content Management

Most content can be updated by editing JSON files:
- `src/data/executives.json` - Executive team profiles
- `src/data/events.json` - Past events
- `src/data/siteConfig.json` - Site configuration
- `src/data/navigation.json` - Navigation links

## 🎯 Features

✅ **Implemented:**
- Responsive design with Aurora theme
- Smooth scroll navigation
- Animated hero section
- Executive team profiles
- Events gallery with year organization
- Constitution section
- Google Sheets API integration (member counter)
- SEO optimization
- Mobile-first responsive design
- Secure environment variable handling
- Production-ready deployment configuration

## 🔄 Future Enhancements

- Google Calendar integration for upcoming events
- Instagram feed embed
- Newsletter subscription
- Member portal with authentication
- Admin dashboard for content management

## 🔧 Troubleshooting

### Common Issues

**"Missing required parameters: spreadsheetId"**
- Check that `GOOGLE_SHEETS_SPREADSHEET_ID` is set correctly in Vercel
- Ensure the spreadsheet ID is copied from the URL

**"The caller does not have permission"**
- Verify the service account email has access to the sheet
- Check that the sheet is shared with the service account

**"Invalid credentials"**
- Verify the private key is copied correctly with quotes and \n characters
- Ensure the service account email matches the JSON file

**Deployment fails on Vercel**
- Check that all environment variables are set in Vercel dashboard
- Verify the build logs for specific error messages

## 📞 Support

For questions or issues, contact:
- Email: uoacalisthenicssociety@gmail.com
- Instagram: @uacs_uoa

## 📚 Additional Resources

- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)