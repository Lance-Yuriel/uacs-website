# UACS Website

A modern, responsive website for the University of Auckland Calisthenics Society built with Next.js, TypeScript, and Tailwind CSS.

## 🌟 Features

- **Aurora-inspired Design**: Dark theme with glassmorphism effects and purple accents
- **Responsive Design**: Mobile-first approach with smooth animations
- **Real-time Member Counter**: Google Sheets API integration
- **Executive Profiles**: Dynamic team member showcase backed by Supabase (full CRUD + photo uploads)
- **Admin Dashboard & Preview**: Secure admin area with drag-and-drop ordering and live expanded-card preview
- **Supabase Storage Uploads**: In-browser image validation, upload progress, and automatic modal preview updates
- **Events Gallery**: Organized by year with collapsible sections
- **Smooth Navigation**: Fixed navbar with active section highlighting
- **SEO Optimized**: Proper metadata and structured data
- **TypeScript**: Full type safety throughout the application

## 🚀 Tech Stack

- **Framework**: Next.js 15.5.6 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Data Fetching**: Supabase client SDKs & server helpers
- **Deployment**: Vercel

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/uacs-website.git
   cd uacs-website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual values
   ```

4. **Configure Supabase Storage:**
   - Follow [`SUPABASE_STORAGE_SETUP.md`](./SUPABASE_STORAGE_SETUP.md) to create the `executive-photos` bucket and policies.

5. **(Optional) Seed Supabase data from JSON:**
   ```bash
   npm run migrate
   ```

6. **Start development server:**
   ```bash
   npm run dev
   ```

7. **Open in browser:**
   ```
   http://localhost:3000
   ```

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run migrate` - Push `executives.json` and `events.json` into Supabase tables

## 📊 Google Sheets Integration

The website includes a real-time member counter powered by Google Sheets API. See [SETUP.md](./SETUP.md) for detailed configuration instructions. Supabase setup instructions live in [`PROJECT_SUMMARY_PROMPT.md`](./PROJECT_SUMMARY_PROMPT.md) and [`SUPABASE_STORAGE_SETUP.md`](./SUPABASE_STORAGE_SETUP.md).

## 🎨 Design System

The site now relies heavily on interactive pieces from [react-bits](https://github.com/cruip/react-bits) to deliver a dynamic feel:

- **Mood**: Dark, high-contrast palette with neutral greys and electric accent hues
- **Typography**: Inter + custom weights for hierarchy
- **Micro-interactions**: Hover reveals, parallax layers, and physics-inspired motion via Framer Motion + react-bits modules (Ripple, Magnetic, Spotlight, Noise)
- **Layout**: Fluid spacing with stacked-to-two-column transitions for admin vs. public view
- **Preview fidelity**: Shared layout component (`ExecutiveProfileContent`) ensures modal and admin preview stay pixel-perfect

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Main homepage
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── layout/           # Layout components
│   ├── home/             # Homepage sections
│   ├── executives/       # Public executive cards + modal
│   └── admin/            # Admin CRUD forms & live preview
├── data/                 # JSON data files (used by migration script)
├── lib/                  # Utility functions & Supabase helpers
├── types/                # TypeScript interfaces
└── hooks/                # Custom React hooks
```

## 📝 Content Management

The executive section is managed directly inside the admin dashboard (Supabase backed). The legacy JSON files remain for migration/testing:

- `src/data/executives.json` - Executive team profiles
- `src/data/events.json` - Past events
- `src/data/siteConfig.json` - Site configuration
- `src/data/navigation.json` - Navigation links

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Import your GitHub repository
   - Add environment variables
   - Deploy!

### Environment Variables

Set these in your Vercel dashboard:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key # used by migration script only
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour key\n-----END PRIVATE KEY-----\n"
```

## 🛡️ Security

- ✅ Environment variables properly configured
- ✅ Service account with minimal permissions
- ✅ No secrets committed to version control
- ✅ HTTPS enforced in production
- ✅ Input validation and error handling

## 🔄 Future Enhancements

- [ ] Google Calendar integration
- [ ] Instagram feed embed
- [ ] Newsletter subscription
- [ ] Member portal with authentication
- [ ] Events management dashboard (next focus)
- [ ] Event registration system

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`