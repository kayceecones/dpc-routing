# DPC Routing MVP
TLDR: 
A routing system to help people find the highest quality care at the lowest necessary cost, making independent practice a more viable option for patients and providers. 

**Purpose**
The direct primary care model is gaining large (and increasing) amounts of popularity. It is more affordable for patients and lower overhead for providers, subverts the need for insurance that is costly in time and energy, and commonly prevents the need for specialty care. Above all of these things, it is toward a model of healthcare that provides the highest value care at the lowest necessary cost, toward the goal of a medical system that is profitable and accessible. 

**Why this tool? **
The majority of direct primary care providers simply _ run _their_ practice_. Providers are responsible for establishing tools, clients, connections with specialists, and the data infrastructure that they create. Much of the responsibility of running a practice is business-focused work that is outside their purview and takes away from their practice as a physician. They don't invest much in marketing or outbound sales, and much of the way patients find them is through word of mouth. Certainly, this works if your goal is to have a panel of 500 patients, but I am clear that there is something very special that will add a lot of value to our society when it is scaled up. 

If we could give DPCs the advantages of a large network while having all the benefits of their own practice and personal relationships with their patients, the model can be scaled to meet society's needs. Certainly, this is not the only thing that would need to be done to scale the direct primary care model, but it is an appropriate first step to meeting patient and provider needs. 

**what the system does**
Hospital systems and insurance companies have (poorly made) tools that get patients in touch with providers who can meet their needs. Because DPC providers run independent practices, their patients basically work on a referral system that leaves some providers overrun with patients they can't treat and others with unmet capacity. By creating a routing system, some initial intake information can be gained from patients who can be directed to providers who have the capacity to provide care to them. For providers, patients can be routed to other care providers when they travel or need to see a specialist. This routing system will provide everyone in the direct primary care ecosystem greater flexibility and findability to increase effective capacity in the total system. 

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
