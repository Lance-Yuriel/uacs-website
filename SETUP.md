# UACS Website Setup Instructions

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
   - Role: None needed
   - Create key → JSON format → Download

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

## 🚀 Deployment

The website is ready to deploy to Vercel:

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

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

## 🔄 Future Enhancements

- Google Calendar integration for upcoming events
- Instagram feed embed
- Newsletter subscription
- Member portal with authentication
- Admin dashboard for content management

## 📞 Support

For questions or issues, contact:
- Email: uoacalisthenicssociety@gmail.com
- Instagram: @uacs_uoa
