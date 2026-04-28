import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Provider, Specialist, Inquiry } from '@/types'
import ToggleAccepting from './toggle-accepting'
import InquiriesSection from './inquiries-section'
import { strings } from '@/lib/i18n'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: provider } = await supabase
    .from('providers')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!provider) {
    return (
      <div className="text-center py-24 max-w-sm mx-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-3">
          {strings.emptyStates.noProfile.heading}
        </h2>
        <p className="text-sm text-gray-500">
          <a href="mailto:support@dpcfinder.com" className="text-blue-600 hover:underline">
            {strings.emptyStates.noProfile.contactSupport}
          </a>{' '}
          {strings.emptyStates.noProfile.or}{' '}
          <a href="/signup" className="text-blue-600 hover:underline">
            {strings.emptyStates.noProfile.signUpAgain}
          </a>.
        </p>
      </div>
    )
  }

  const p = provider as Provider

  const [inquiryResult, nearbyProvidersResult, nearbySpecialistsResult] = await Promise.all([
    supabase
      .from('patient_inquiries')
      .select('*')
      .eq('provider_id', p.id)
      .eq('read', false)
      .order('created_at', { ascending: false })
      .limit(5),
    p.state
      ? supabase
          .from('providers')
          .select('id, name, city, monthly_cost, accepting_patients')
          .eq('state', p.state)
          .neq('id', p.id)
          .order('name')
          .limit(6)
      : Promise.resolve({ data: [] }),
    p.state
      ? supabase
          .from('specialists')
          .select('id, name, specialty, city')
          .eq('state', p.state)
          .order('name')
          .limit(6)
      : Promise.resolve({ data: [] }),
  ])

  const inquiries = (inquiryResult.data ?? []) as Inquiry[]
  const nearbyProviders = (nearbyProvidersResult.data ?? []) as Pick<Provider, 'id' | 'name' | 'city' | 'monthly_cost' | 'accepting_patients'>[]
  const nearbySpecialists = (nearbySpecialistsResult.data ?? []) as Pick<Specialist, 'id' | 'name' | 'specialty' | 'city'>[]

  return (
    <div className="space-y-10">
      {/* Profile card */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 mb-6">{strings.dashboard.title}</h1>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{p.name}</h2>
              {p.city && (
                <p className="text-sm text-gray-500 mt-1">
                  {[p.city, p.state].filter(Boolean).join(', ')}
                </p>
              )}
              {p.monthly_cost != null && (
                <p className="text-sm text-gray-500 mt-1">${p.monthly_cost}/mo</p>
              )}
            </div>
            <ToggleAccepting providerId={p.id} accepting={p.accepting_patients} />
          </div>

          {!p.bio && !p.city && (
            <p className="mt-4 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
              {strings.dashboard.incompleteProfile}{' '}
              <a href="/dashboard/profile" className="underline font-medium">
                {strings.dashboard.fillItOut}
              </a>{' '}
              {strings.dashboard.soPatientsCanFindYou}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <a
            href="/dashboard/profile"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            {strings.dashboard.editProfile}
          </a>
          <a
            href={`/providers/${p.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            {strings.dashboard.viewPublicProfile}
          </a>
        </div>
      </div>

      {/* Inquiries */}
      <div className="border-t border-gray-200 pt-8">
        <InquiriesSection initialInquiries={inquiries} />
      </div>

      {/* Nearby sections — only visible when provider has a state */}
      {p.state && (
        <>
          {/* DPC providers in your state */}
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {strings.nearby.dpcHeading}
            </h2>
            {nearbyProviders.length === 0 ? (
              <p className="text-sm text-gray-500">{strings.nearby.noDpcProviders}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {nearbyProviders.map((np) => (
                  <div key={np.id} className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-medium text-gray-900 text-sm leading-snug">{np.name}</p>
                      <span className={`ml-2 shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${
                        np.accepting_patients
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {np.accepting_patients ? strings.landing.accepting : strings.provider.full}
                      </span>
                    </div>
                    {np.city && (
                      <p className="text-xs text-gray-500">{np.city}</p>
                    )}
                    {np.monthly_cost != null && (
                      <p className="text-xs text-gray-600 mt-1">${np.monthly_cost}/mo</p>
                    )}
                    <Link
                      href={`/dashboard/referrals?to_provider_id=${np.id}`}
                      className="mt-3 block text-center text-xs font-medium text-blue-600 border border-blue-200 rounded-lg py-1.5 hover:bg-blue-50 transition-colors"
                    >
                      {strings.nearby.sendReferral}
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Specialists in your state */}
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {strings.nearby.specialistsHeading}
            </h2>
            {nearbySpecialists.length === 0 ? (
              <p className="text-sm text-gray-500">{strings.nearby.noSpecialists}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {nearbySpecialists.map((ns) => (
                  <div key={ns.id} className="bg-white rounded-xl border border-gray-200 p-4">
                    <p className="font-medium text-gray-900 text-sm">{ns.name}</p>
                    {ns.specialty && (
                      <p className="text-xs text-blue-600 font-medium mt-0.5">{ns.specialty}</p>
                    )}
                    {ns.city && (
                      <p className="text-xs text-gray-500 mt-0.5">{ns.city}</p>
                    )}
                    <Link
                      href={`/dashboard/referrals?to_specialist_id=${ns.id}`}
                      className="mt-3 block text-center text-xs font-medium text-blue-600 border border-blue-200 rounded-lg py-1.5 hover:bg-blue-50 transition-colors"
                    >
                      {strings.nearby.sendReferral}
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
