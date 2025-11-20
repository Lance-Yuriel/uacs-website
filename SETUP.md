# UACS Website – Setup Quick Reference

This short guide keeps common local tasks in one place. Detailed documentation now lives in the README and focused setup guides.

## Security Essentials

- `.env.local`, Supabase keys, and Google service-account files must stay out of version control.
- Share secrets only over secure channels; rotate keys if they leak.

## Local Development

```bash
npm install
npm run dev
# visit http://localhost:3000
```

Copy `.env.example` to `.env.local` and add Supabase + Google Sheets values (see README “Required Environment Variables”).

## Where to Find Detailed Instructions

- Supabase project/database bootstrap → `SETUP_SUPABASE.md`
- Admin authentication workflow → `SETUP_ADMIN_AUTH.md`
- Supabase Storage bucket policies → `SUPABASE_STORAGE_SETUP.md`
- Full project overview, architecture, and validation rules → `README.md`

## Deployment Snapshot

1. Push code to GitHub with `.env.local` ignored.
2. On Vercel, import the repository and configure environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, Google Sheets credentials, optional `SUPABASE_SERVICE_ROLE_KEY`).
3. Deploy and attach a custom domain if needed.

For troubleshooting tips, refer to the dedicated guides or the README “Security & Deployment” section.