import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Provider } from '@/types'
import ToggleAccepting from './toggle-accepting'

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
      <div className="text-center py-20">
        <p className="text-gray-500">No provider profile found.</p>
      </div>
    )
  }

  const p = provider as Provider

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Your profile</h1>

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

          <ToggleAccepting
            providerId={p.id}
            accepting={p.accepting_patients}
          />
        </div>

        {!p.bio && !p.city && (
          <p className="mt-4 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
            Your profile is incomplete.{' '}
            <a href="/dashboard/profile" className="underline font-medium">
              Fill it out
            </a>{' '}
            so patients can find you.
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <a
          href="/dashboard/profile"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          Edit profile
        </a>
        <a
          href={`/providers/${p.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
        >
          View public profile
        </a>
      </div>
    </div>
  )
}
