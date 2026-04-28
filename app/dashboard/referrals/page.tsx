import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Provider, Specialist, Referral } from '@/types'
import ReferralsClient from './referrals-client'

interface SearchParams {
  to_provider_id?: string
  to_specialist_id?: string
}

export default async function ReferralsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { to_provider_id, to_specialist_id } = await searchParams

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: provider } = await supabase
    .from('providers')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!provider) redirect('/dashboard')

  const [inboxResult, dpcResult, specialistsResult] = await Promise.all([
    supabase
      .from('referrals')
      .select(`
        *,
        from_provider:from_provider_id (id, name, city, state),
        to_provider:to_provider_id (id, name),
        to_specialist:to_specialist_id (id, name, specialty)
      `)
      .eq('to_provider_id', provider.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('providers')
      .select('id, name, city, state, monthly_cost, accepting_patients')
      .eq('accepting_patients', true)
      .neq('id', provider.id)
      .order('name'),
    supabase
      .from('specialists')
      .select('*')
      .order('name'),
  ])

  return (
    <ReferralsClient
      providerId={provider.id}
      inbox={(inboxResult.data ?? []) as Referral[]}
      dpcProviders={(dpcResult.data ?? []) as Provider[]}
      specialists={(specialistsResult.data ?? []) as Specialist[]}
      initialProviderId={to_provider_id}
      initialSpecialistId={to_specialist_id}
    />
  )
}
