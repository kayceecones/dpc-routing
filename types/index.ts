export interface Provider {
  id: string
  name: string
  bio: string | null
  location: string | null
  city: string | null
  state: string | null
  zip: string | null
  phone: string | null
  email: string | null
  website: string | null
  monthly_cost: number | null
  enrollment_fee: number | null
  accepting_patients: boolean
  created_at: string
  user_id: string | null
}

export interface Specialist {
  id: string
  name: string
  specialty: string | null
  location: string | null
  city: string | null
  state: string | null
  phone: string | null
  email: string | null
}

export interface Inquiry {
  id: string
  provider_id: string
  patient_name: string
  patient_email: string
  message: string | null
  created_at: string
  read: boolean
}

export interface Referral {
  id: string
  from_provider_id: string
  to_provider_id: string | null
  to_specialist_id: string | null
  patient_name: string
  note: string | null
  referral_type: 'dpc' | 'specialist'
  created_at: string
  from_provider?: Provider
  to_provider?: Provider
  to_specialist?: Specialist
}
