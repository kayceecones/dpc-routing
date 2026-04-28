import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Provider } from '@/types'
import { strings } from '@/lib/i18n'
import ContactForm from '@/components/ContactForm'
import Link from 'next/link'

export default async function ProviderPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: provider } = await supabase
    .from('providers')
    .select('*')
    .eq('id', id)
    .single()

  if (!provider) notFound()

  const p = provider as Provider

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-4">
      {!p.user_id && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-4">
          <p className="text-sm text-blue-800">
            {strings.claim.banner}{' '}
            <Link
              href={`/signup?claim=${p.id}`}
              className="font-semibold underline hover:text-blue-600"
            >
              {strings.claim.cta}
            </Link>{' '}
            {strings.claim.bannerSuffix}
          </p>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="flex items-start justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{p.name}</h1>
          <span
            className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${
              p.accepting_patients
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {p.accepting_patients ? strings.provider.acceptingPatients : strings.provider.full}
          </span>
        </div>

        {p.bio && (
          <p className="text-gray-600 text-sm leading-relaxed mb-6">{p.bio}</p>
        )}

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {p.city && (
            <div>
              <dt className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">{strings.provider.location}</dt>
              <dd className="text-gray-900">
                {[p.city, p.state, p.zip].filter(Boolean).join(', ')}
              </dd>
            </div>
          )}
          {p.monthly_cost != null && (
            <div>
              <dt className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">{strings.provider.monthlyCost}</dt>
              <dd className="text-gray-900">${p.monthly_cost}/mo</dd>
            </div>
          )}
          {p.enrollment_fee != null && (
            <div>
              <dt className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">{strings.provider.enrollmentFee}</dt>
              <dd className="text-gray-900">
                {p.enrollment_fee === 0 ? strings.provider.noEnrollmentFee : `$${p.enrollment_fee}`}
              </dd>
            </div>
          )}
          {p.phone && (
            <div>
              <dt className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">{strings.provider.phone}</dt>
              <dd className="text-gray-900">{p.phone}</dd>
            </div>
          )}
          {p.email && (
            <div>
              <dt className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">{strings.provider.email}</dt>
              <dd className="text-gray-900">{p.email}</dd>
            </div>
          )}
          {p.website && (
            <div>
              <dt className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">{strings.provider.website}</dt>
              <dd>
                <a
                  href={p.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {p.website.replace(/^https?:\/\//, '')}
                </a>
              </dd>
            </div>
          )}
        </dl>
      </div>

      {p.accepting_patients && <ContactForm providerId={p.id} />}
    </div>
  )
}
