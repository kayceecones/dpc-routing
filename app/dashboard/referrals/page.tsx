import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Provider, Specialist, Referral } from '@/types'
import ReferralsClient from './referrals-client'

export default async function ReferralsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: provider } = await supabase
    .from('providers')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!provider) redirect('/dashboard')

  // Load inbox: referrals TO this provider
  const { data: inbox } = await supabase
    .from('referrals')
    .select(`
      *,
      from_provider:from_provider_id (id, name, city, state),
      to_provider:to_provider_id (id, name),
      to_specialist:to_specialist_id (id, name, specialty)
    `)
    .eq('to_provider_id', provider.id)
    .order('created_at', { ascending: false })

  // Load open DPC providers (accepting) for search
  const { data: dpcProviders } = await supabase
    .from('providers')
    .select('id, name, city, state, monthly_cost, accepting_patients')
    .eq('accepting_patients', true)
    .neq('id', provider.id)
    .order('name')

  // Load specialists
  const { data: specialists } = await supabase
    .from('specialists')
    .select('*')
    .order('name')

  return (
    <ReferralsClient
      providerId={provider.id}
      inbox={(inbox ?? []) as Referral[]}
      dpcProviders={(dpcProviders ?? []) as Provider[]}
      specialists={(specialists ?? []) as Specialist[]}
    />
  )
}
