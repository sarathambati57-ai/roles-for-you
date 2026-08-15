# Roles_for_you_

**Find Your Next Opportunity** — a public job portal + private admin dashboard, built for the
`@Roles_for_you_` Instagram page.

Stack: **Next.js 14 (App Router) + TypeScript + Tailwind CSS + Supabase** (PostgreSQL, Auth, Storage).
Deploy target: **Vercel**.

---

## 1. What's included

- Public site: homepage, job search/filters, individual job pages with SEO + JobPosting schema,
  companies page, about/contact, WhatsApp-optimized sharing.
- Admin dashboard at `/admin`: login, stats, add/edit/delete/publish/duplicate jobs, rich text
  description editor, logo upload, featured/urgent flags.
- Supabase schema with Row Level Security: the public can only ever read `published` jobs; only an
  authenticated user (you) can write.
- 3 sample jobs (EY, Concentrix, HSBC) marked `is_sample = true` so you can see the site working
  immediately, and can bulk-delete them later.

---

## 2. Create your Supabase project

1. Go to [supabase.com](https://supabase.com) → **New Project**.
2. Choose a name (e.g. `roles-for-you`), a strong database password, and the region closest to your
   users (e.g. Mumbai/Singapore for India).
3. Wait for the project to finish provisioning (~2 minutes).

## 3. Create the database tables

1. In your Supabase project, open **SQL Editor** → **New query**.
2. Paste the entire contents of [`supabase/schema.sql`](./supabase/schema.sql) and click **Run**.
   This creates the `jobs` and `contact_messages` tables, indexes, RLS policies, the
   `company-logos` storage bucket, and inserts the 3 sample jobs.

## 4. Get your environment variables

1. In Supabase: **Project Settings → API**.
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret — only used locally to
     create your admin account, never shipped to the browser)
3. Copy `.env.example` to `.env.local` and fill in the values, plus `NEXT_PUBLIC_SITE_URL` (use
   `http://localhost:3000` for now).

```bash
cp .env.example .env.local
```

## 5. Set up admin authentication

This project treats **any authenticated Supabase user in this project as the admin** — there's no
separate roles table, because you're the only person who will ever log in.

1. In Supabase: **Authentication → Providers → Email**, make sure Email is enabled.
2. **Authentication → Settings**, turn **OFF** "Allow new users to sign up" (important — this
   prevents anyone else from ever creating an account).
3. Create your own account with the seed script:

```bash
npm install
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD="a-strong-password" \
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key \
npm run seed
```

   (Alternatively, create the user manually in **Authentication → Users → Add User**, and tick
   "Auto Confirm User".)

## 6. Run locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` for the public site, and `http://localhost:3000/admin/login` to log
in with the account you just created.

## 7. Deploy to Vercel

1. Push this project to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the repo.
3. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` → your final domain, e.g. `https://rolesforyou.in` (you can update this
     after step 8 and redeploy)
   - (Optional) `SUPABASE_SERVICE_ROLE_KEY` only if you plan to re-run the seed script from Vercel;
     not required for normal operation.
4. Click **Deploy**.

## 8. Connect your custom domain

1. In Vercel: **Project → Settings → Domains** → add `rolesforyou.in` (or whatever you registered).
2. Follow Vercel's instructions to point your domain's DNS (usually an `A` record to Vercel's IP or
   a `CNAME` to `cname.vercel-dns.com`) at your registrar.
3. Once verified, update `NEXT_PUBLIC_SITE_URL` in Vercel's env vars to the final domain and
   redeploy, so SEO tags and the sitemap use the right URL.

## 9. Add your first real job

1. Go to `yourdomain.com/admin/login` and sign in.
2. Click **Add New Job**.
3. Fill in company, role, eligibility, salary, deadline, paste the JD into the rich text editor,
   upload the company logo, add the application URL.
4. Set **Status** to **Published**, save.
5. It's now live at `yourdomain.com/jobs/<slug>` — copy that link into your Instagram DM workflow.
6. Once you're happy with real listings, delete the 3 sample jobs from **Manage Jobs**.

---

## Project structure

```
app/
  page.tsx                 Homepage
  jobs/page.tsx             Job listing + filters
  jobs/[slug]/page.tsx       Individual job page (SEO + schema.org)
  companies/page.tsx        Companies directory
  about/, contact/, privacy/, terms/
  admin/
    login/page.tsx           Public login form
    (protected)/             Everything below requires auth (via middleware.ts)
      layout.tsx              Sidebar shell
      page.tsx                 Dashboard stats
      jobs/page.tsx            Manage jobs table
      jobs/new/page.tsx        Add job form
      jobs/[id]/edit/page.tsx  Edit job form
  api/contact/route.ts       Contact form submission
  sitemap.ts, robots.ts
components/                 Shared UI (Navbar, Footer, JobCard, filters, etc.)
components/admin/           Admin-only UI (JobForm, RichTextEditor, LogoUploader)
lib/
  supabase/                 Browser + server Supabase clients
  actions/                  Server Actions (auth.ts, jobs.ts)
  jobs.ts, utils.ts
types/job.ts
supabase/schema.sql         Full DB schema + RLS + sample data
middleware.ts               Protects /admin/* routes
```

## Security notes

- RLS enforces that anonymous visitors can only ever `SELECT` jobs where `status = 'published'`.
  Draft jobs are invisible to the public even if someone guesses the URL.
- All writes (`insert`/`update`/`delete`) require an authenticated Supabase session — enforced at
  the database level, not just in the UI.
- `middleware.ts` redirects any unauthenticated visit to `/admin/*` (except `/admin/login`) back to
  the login page — this runs on Vercel's edge for every request.
- Rich text job descriptions are sanitized with DOMPurify before being stored, and rendered with
  `rel="noopener noreferrer nofollow"` on outbound apply links.
- No credentials are hardcoded anywhere in the codebase — everything comes from environment
  variables you set in Vercel/Supabase.

## Extending later

- Swap the placeholder `R.` logo mark in `components/Logo.tsx` for your real Instagram logo image.
- Add a `job_views` counter or Plausible/GA if you want click analytics per listing.
- If you ever need multiple admin accounts with different permissions, add a `profiles` table with
  a `role` column and adjust the RLS policies in `supabase/schema.sql` accordingly.
