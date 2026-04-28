import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { strings } from '@/lib/i18n'

export const revalidate = 3600

export default async function HomePage() {
  const supabase = await createClient()

  const [{ count }, { data: stateRows }] = await Promise.all([
    supabase.from('providers').select('*', { count: 'exact', head: true }),
    supabase.from('providers').select('state').not('state', 'is', null),
  ])

  const totalProviders = count ?? 0
  const distinctStates = new Set(stateRows?.map((r) => r.state)).size

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-4 py-16">
      {/* Header */}
      <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
        {strings.landing.appName}
      </h1>
      <p className="text-gray-500 text-base mb-12 text-center max-w-sm">
        {strings.landing.subheadline}
      </p>

      {/* Role cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-xl mb-14">
        <Link
          href="/find"
          className="flex flex-col items-center gap-4 bg-white border border-gray-200 rounded-2xl p-8 hover:border-blue-300 hover:shadow-md transition-all group"
        >
          <span className="text-blue-600 group-hover:scale-110 transition-transform">
            <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </span>
          <span className="text-sm font-semibold text-gray-800 text-center">
            {strings.landing.patientCard}
          </span>
        </Link>

        <Link
          href="/login"
          className="flex flex-col items-center gap-4 bg-white border border-gray-200 rounded-2xl p-8 hover:border-blue-300 hover:shadow-md transition-all group"
        >
          <span className="text-blue-600 group-hover:scale-110 transition-transform">
            <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 4v4a5 5 0 0010 0V4" />
              <line x1="7" y1="4" x2="7" y2="2" />
              <line x1="17" y1="4" x2="17" y2="2" />
              <path d="M12 13v2" />
              <path d="M12 15q0 4.5 4.5 4.5" />
              <circle cx="16.5" cy="19.5" r="1.5" fill="currentColor" stroke="none" />
            </svg>
          </span>
          <span className="text-sm font-semibold text-gray-800 text-center">
            {strings.landing.providerCard}
          </span>
        </Link>
      </div>

      {/* What is DPC */}
      <div className="w-full max-w-xl mb-12">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          {strings.landing.whatIsDpc}
        </p>
        <ul className="space-y-2">
          {strings.landing.dpcBullets.map((bullet) => (
            <li key={bullet} className="flex items-center gap-2.5 text-sm text-gray-600">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
              {bullet}
            </li>
          ))}
        </ul>
      </div>

      {/* Stat bar */}
      <p className="text-xs text-gray-400">
        {strings.landing.statBar(totalProviders, distinctStates)}
      </p>
    </div>
  )
}
