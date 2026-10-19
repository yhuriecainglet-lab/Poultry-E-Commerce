# Poultry E-Commerce

Next.js App Router + TypeScript + Tailwind CSS + Supabase poultry (chicken) e-commerce site.

## Tech stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4
- Supabase: database, auth, storage
- Vercel: deployment
- GitHub: version control

Out of scope: cart, payments, checkout, customer accounts.

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Supabase setup

Create a project at [supabase.com](https://supabase.com), then:

1. Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

2. In the Supabase SQL Editor, run `supabase/schema.sql` (creates `categories`, `chickens`, RLS policies, and the `chicken-images` storage bucket).
3. Run `supabase/seed.sql` to insert 3 age categories and 9 sample chickens.
4. In **Authentication > Settings**, note your `SITE URL` (e.g. `http://localhost:3000` for local dev, your Vercel URL for production).
5. Create an admin user: either sign up through the app at `/admin/login` (first sign-up creates the account), or create the user in **Authentication > Users**. To restrict dashboard access to one email, set `ADMIN_EMAIL` in `.env.local`.

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available scripts

```bash
npm run dev      # start dev server (Turbopack)
npm run build    # production build
npm run start    # start production server
npm run lint     # run ESLint
```

## Project structure

- `app/` — Next.js App Router pages (public + `/admin`)
- `components/` — shared UI components (Navbar, Footer, ProductCard, AvailabilityBadge, etc.)
- `components/admin/` — admin-specific components (LoginForm, AdminHeader, AdminChickensTable, Toast)
- `lib/` — config, types, helpers, Supabase clients, server actions
- `supabase/` — `schema.sql` and `seed.sql`
- `public/` — static assets

## Admin features

- `/admin/login` — Supabase email/password login
- `/admin` — dashboard overview with stock stats
- `/admin/chickens` — chicken list with search, category filter, publish/featured toggles, delete
- `/admin/chickens/new` — add chicken with image upload
- `/admin/chickens/[id]/edit` — edit chicken, add/replace images
- `/admin/categories` — manage age categories

Route protection: `/admin` layout requires a Supabase session; optionally restrict to `ADMIN_EMAIL`.

## Deploy to Vercel

1. Push this repository to GitHub:

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. In [Vercel](https://vercel.com), click **Add New Project** and import the GitHub repo.
3. Add the environment variables (from `.env.local`):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAIL` (optional)

4. Deploy. On production, also update your Supabase project's **Authentication > Settings > Site URL** to your Vercel URL and add it to **Redirect URLs**.

## Environment variables

See `.env.example` for the full list with descriptions. Never commit `.env.local` — it is already in `.gitignore`.
