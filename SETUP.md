# UACS Website – Setup Quick Reference

This short guide keeps common local tasks in one place. Detailed documentation now lives in the README and focused setup guides.

## Security Essentials

- `.env.local`, Firebase credentials, and Google service-account files must stay out of version control.
- Share secrets only over secure channels; rotate keys if they leak.

## Local Development

```bash
npm install
npm run dev
# visit http://localhost:3000
```

Copy your Firebase Web Config details to `.env.local` along with Google Sheets values (see README “Required Environment Variables”).

## Where to Find Detailed Instructions

- Admin authentication workflow & users configuration → [SETUP_ADMIN_AUTH.md](./SETUP_ADMIN_AUTH.md)
- Full project overview, environment variables schema, and architecture → [README.md](./README.md)
- Deployment guide for Vercel → [VERCEL_HOSTING_GUIDE.md](./VERCEL_HOSTING_GUIDE.md)

## Deployment Snapshot

1. Push code to GitHub with `.env.local` ignored.
2. On Vercel, import the repository and configure environment variables:
   - Client Firebase Config: `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`.
   - Server Google / Firebase SDK keys: `GOOGLE_SHEETS_SPREADSHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY` (also used as fallback for Firebase Admin SDK).
3. Deploy and attach a custom domain if needed.

For troubleshooting tips, refer to the dedicated guides or the README “Security & Deployment” section.
