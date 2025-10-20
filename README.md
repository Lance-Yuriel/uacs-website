# UACS Website

A modern, responsive website for the University of Auckland Calisthenics Society built with Next.js, TypeScript, and Tailwind CSS.

## 🌟 Features

- **Aurora-inspired Design**: Dark theme with glassmorphism effects and purple accents
- **Responsive Design**: Mobile-first approach with smooth animations
- **Real-time Member Counter**: Google Sheets API integration
- **Executive Profiles**: Dynamic team member showcase
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
- **Data Fetching**: TanStack Query
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

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   ```
   http://localhost:3000
   ```

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📊 Google Sheets Integration

The website includes a real-time member counter powered by Google Sheets API. See [SETUP.md](./SETUP.md) for detailed configuration instructions.

## 🎨 Design System

The website uses a custom Aurora-inspired design system with:

- **Colors**: Dark theme with purple (#8B5CF6) accents
- **Typography**: Inter font family
- **Effects**: Glassmorphism with backdrop blur
- **Animations**: Smooth transitions and micro-interactions
- **Layout**: Centered container with proper spacing

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
│   ├── executives/       # Executive team
│   └── events/           # Events gallery
├── data/                 # JSON data files
├── lib/                  # Utility functions
├── types/                # TypeScript interfaces
└── hooks/                # Custom React hooks
```

## 📝 Content Management

Most content can be updated by editing JSON files:

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
- [ ] Admin dashboard
- [ ] Event registration system

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- **Email**: uoacalisthenicssociety@gmail.com
- **Instagram**: [@uacs_nz](https://instagram.com/uacs_nz)
- **Website**: [https://uacs.vercel.app](https://uacs.vercel.app)

## 🙏 Acknowledgments

- Design inspiration from Aurora design system
- Icons by [Lucide](https://lucide.dev)
- Built with [Next.js](https://nextjs.org)
- Deployed on [Vercel](https://vercel.com)

---

**Made with ❤️ for the University of Auckland Calisthenics Society**