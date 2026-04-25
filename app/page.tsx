import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Provider } from '@/types'

interface SearchParams {
  q?: string
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { q } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('providers')
    .select('*')
    .eq('accepting_patients', true)
    .order('created_at', { ascending: false })

  if (q) {
    query = query.or(`city.ilike.%${q}%,state.ilike.%${q}%,zip.ilike.%${q}%`)
  }

  const { data: providers } = await query

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Find a Direct Primary Care Provider
        </h1>
        <p className="text-gray-500">
          Affordable, membership-based primary care — no insurance required.
        </p>
      </div>

      <form method="GET" className="flex gap-2 max-w-xl mx-auto mb-10">
        <input
          type="text"
          name="q"
          defaultValue={q ?? ''}
          placeholder="Search by city, state, or zip..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {providers && providers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(providers as Provider[]).map((provider) => (
            <Link
              key={provider.id}
              href={`/providers/${provider.id}`}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <h2 className="font-semibold text-gray-900 text-base leading-snug">
                  {provider.name}
                </h2>
                <span className="ml-2 shrink-0 inline-block text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  Accepting
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-3">
                {[provider.city, provider.state].filter(Boolean).join(', ') || 'Location not listed'}
              </p>
              {provider.monthly_cost != null && (
                <p className="text-sm font-medium text-gray-700">
                  ${provider.monthly_cost}/mo
                </p>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-16">
          {q ? `No providers found for "${q}".` : 'No providers available right now.'}
        </p>
      )}
    </div>
  )
}
