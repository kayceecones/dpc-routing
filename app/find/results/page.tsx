import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Provider } from '@/types'
import { matchProviders, BUDGET_MAX } from '@/lib/matching'
import { strings } from '@/lib/i18n'
import CopyLinkButton from '@/components/CopyLinkButton'

interface SearchParams {
  location?: string
  budget?: string
  needs?: string
}

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { location, budget, needs: needsParam } = await searchParams

  const maxCost = budget ? BUDGET_MAX[budget] : undefined
  const needs = needsParam ? needsParam.split(',').filter(Boolean) : []

  const supabase = await createClient()
  const { data } = await supabase
    .from('providers')
    .select('*')
    .eq('accepting_patients', true)

  const providers = data as Provider[] ?? []

  const results = matchProviders(providers, {
    location,
    maxCost,
    needs,
  })

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {strings.results.title}
        </h1>
        {location && (
          <p className="text-sm text-gray-500">{strings.results.subtitle(location)}</p>
        )}
      </div>

      {results.length === 0 ? (
        <div className="text-center py-16 max-w-sm mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {strings.emptyStates.noResults.heading}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {strings.emptyStates.noResults.subheading}
          </p>
          <p className="text-sm text-gray-600 mb-8">
            {strings.emptyStates.noResults.cta}{' '}
            <CopyLinkButton
              label={strings.emptyStates.noResults.shareLink}
              copiedLabel={strings.emptyStates.noResults.copied}
            />{' '}
            {strings.emptyStates.noResults.shareAfter}
          </p>
          <Link href="/find" className="text-sm text-gray-400 hover:text-gray-600">
            ← {strings.results.startOver}
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {results.map((provider) => (
              <div
                key={provider.id}
                className="bg-white rounded-xl border border-gray-200 p-5"
              >
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h2 className="font-semibold text-gray-900">{provider.name}</h2>
                    {(provider.city || provider.state) && (
                      <p className="text-sm text-gray-500 mt-0.5">
                        {[provider.city, provider.state].filter(Boolean).join(', ')}
                      </p>
                    )}
                  </div>
                  <span className="ml-3 shrink-0 text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    {strings.landing.accepting}
                  </span>
                </div>

                {provider.monthly_cost != null && (
                  <p className="text-sm font-medium text-gray-700 mt-2">
                    {strings.results.perMonth(provider.monthly_cost)}
                  </p>
                )}

                {provider.matchReasons.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {provider.matchReasons.map((reason) => (
                      <span
                        key={reason}
                        className="text-xs px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full font-medium"
                      >
                        {reason}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Link
                    href={`/providers/${provider.id}`}
                    className="text-sm text-blue-600 font-medium hover:underline"
                  >
                    {strings.results.viewProfile} →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <Link href="/find" className="text-sm text-gray-400 hover:text-gray-600">
            ← {strings.results.startOver}
          </Link>
        </>
      )}
    </div>
  )
}
