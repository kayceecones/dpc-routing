import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const { provider_id, patient_name, patient_email, message } = await req.json()

  if (!provider_id || !patient_name || !patient_email) {
    return NextResponse.json(
      { data: null, error: 'Missing required fields.' },
      { status: 400 }
    )
  }

  const supabase = await createClient()
  const { error } = await supabase.from('patient_inquiries').insert({
    provider_id,
    patient_name,
    patient_email,
    message: message || null,
  })

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data: { success: true }, error: null })
}
