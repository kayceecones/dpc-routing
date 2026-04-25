# DPC Routing MVP

A web app that helps patients find Direct Primary Care (DPC) providers and helps providers refer patients to other DPCs or specialists.

## Stack

- **Next.js 16** (App Router)
- **Supabase** (Postgres + Auth)
- **Tailwind CSS**

---

## Setup

### 1. Create a Supabase project

Go to [supabase.com](https://supabase.com), create a new project, and grab your **Project URL** and **anon public key** from Settings → API.

### 2. Run the database migration

In the Supabase dashboard, open the **SQL Editor** and paste the contents of `supabase/migration.sql`, then run it. This creates all tables, RLS policies, and seeds the database with 5 fake providers and 5 fake specialists.

### 3. Configure environment variables

Edit `.env.local` and fill in your values:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Install dependencies and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Pages

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Search for DPC providers by city/state/zip |
| `/providers/[id]` | Public | Provider detail page |
| `/signup` | Public | Create a provider account |
| `/login` | Public | Log in |
| `/dashboard` | Auth | Overview + accepting patients toggle |
| `/dashboard/profile` | Auth | Edit profile fields |
| `/dashboard/referrals` | Auth | Send referrals / view inbox |

---

## Notes

- Signup creates both an auth user and a providers row in one step
- Providers can only edit their own profile (enforced via RLS)
- The public search only shows providers with `accepting_patients = true`
- Referrals must target either a DPC provider or a specialist, not both (enforced by DB constraint)
