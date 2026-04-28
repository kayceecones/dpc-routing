# DPC Finder

[Live demo](https://your-vercel-url.vercel.app)

## Purpose

The direct primary care model is gaining large (and increasing) amounts of popularity. It is more affordable for patients and lower overhead for providers, subverts the need for insurance that is costly in time and energy, and commonly prevents the need for specialty care. Above all of these things, it is toward a model of healthcare that provides the highest value care at the lowest necessary cost, toward the goal of a medical system that is profitable and accessible.

## Why this tool?

The majority of direct primary care providers simply run their practice. Providers are responsible for establishing tools, clients, connections with specialists, and the data infrastructure that they create. Much of the responsibility of running a practice is business-focused work that is outside their purview and takes away from their practice as a physician. They don't invest much in marketing or outbound sales, and much of the way patients find them is through word of mouth. Certainly, this works if your goal is to have a panel of 500 patients, but I am clear that there is something very special that will add a lot of value to our society when it is scaled up.

If we could give DPCs the advantages of a large network while having all the benefits of their own practice and personal relationships with their patients, the model can be scaled to meet society's needs. Certainly, this is not the only thing that would need to be done to scale the direct primary care model, but it is an appropriate first step to meeting patient and provider needs.

## What is this?

Direct Primary Care (DPC) is a healthcare model where patients pay a flat monthly membership directly to their primary care doctor — no insurance middleman, no per-visit billing. Despite growing rapidly, DPC practices are notoriously hard to find: they don't appear in insurance directories, and there's no standard way for providers to refer patients to other DPC doctors or specialists. DPC Finder solves both problems by giving providers a public profile and a built-in referral system, and giving patients a simple way to search for care near them.

## Who it's for

- **DPC providers** — create a profile, manage availability, and send/receive referrals
- **Patients** — search for accepting DPC providers by location

## Features

- Patient-facing provider search by city, state, or zip
- Public provider profile pages
- Provider dashboard with accepting-patients toggle
- Profile editor for providers
- Referral system supporting both DPC-to-DPC and DPC-to-specialist referrals

## Tech stack

- **Next.js** (App Router)
- **Supabase** (Postgres + Auth + RLS)
- **Tailwind CSS**
- **TypeScript**

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
| `/` | Public | Role-selection landing page |
| `/find` | Public | Patient intake + provider search |
| `/find/results` | Public | Matched provider results |
| `/providers/[id]` | Public | Provider detail + contact form |
| `/about` | Public | About the project |
| `/signup` | Public | Create a provider account |
| `/login` | Public | Log in |
| `/dashboard` | Auth | Overview + inquiries + nearby network |
| `/dashboard/profile` | Auth | Edit profile fields |
| `/dashboard/referrals` | Auth | Send referrals / view inbox |
