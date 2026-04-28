'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Provider, Specialist, Referral } from '@/types'
import { strings } from '@/lib/i18n'

type Tab = 'send' | 'inbox'

export default function ReferralsClient({
  providerId,
  inbox,
  dpcProviders,
  specialists,
  initialProviderId,
  initialSpecialistId,
}: {
  providerId: string
  inbox: Referral[]
  dpcProviders: Provider[]
  specialists: Specialist[]
  initialProviderId?: string
  initialSpecialistId?: string
}) {
  const [tab, setTab] = useState<Tab>('send')

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">{strings.referrals.title}</h1>

      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {(['send', 'inbox'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 -mb-px transition-colors ${
              tab === t
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'inbox' ? strings.referrals.inbox(inbox.length) : strings.referrals.sendReferral}
          </button>
        ))}
      </div>

      {tab === 'send' ? (
        <SendReferral
          providerId={providerId}
          dpcProviders={dpcProviders}
          specialists={specialists}
          initialProviderId={initialProviderId}
          initialSpecialistId={initialSpecialistId}
        />
      ) : (
        <Inbox inbox={inbox} />
      )}
    </div>
  )
}

function SendReferral({
  providerId,
  dpcProviders,
  specialists,
  initialProviderId,
  initialSpecialistId,
}: {
  providerId: string
  dpcProviders: Provider[]
  specialists: Specialist[]
  initialProviderId?: string
  initialSpecialistId?: string
}) {
  const router = useRouter()
  const [type, setType] = useState<'dpc' | 'specialist'>(
    initialSpecialistId ? 'specialist' : 'dpc'
  )
  const [targetId, setTargetId] = useState(initialProviderId ?? initialSpecialistId ?? '')
  const [search, setSearch] = useState(() => {
    if (initialProviderId) {
      return dpcProviders.find((p) => p.id === initialProviderId)?.name ?? ''
    }
    if (initialSpecialistId) {
      return specialists.find((s) => s.id === initialSpecialistId)?.name ?? ''
    }
    return ''
  })
  const [patientName, setPatientName] = useState('')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const filteredDpc = dpcProviders.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.city ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (p.state ?? '').toLowerCase().includes(search.toLowerCase())
  )

  const filteredSpecialists = specialists.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.specialty ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (s.city ?? '').toLowerCase().includes(search.toLowerCase())
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!targetId) {
      setError(strings.referrals.selectRecipient)
      return
    }
    setSaving(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.from('referrals').insert({
      from_provider_id: providerId,
      to_provider_id: type === 'dpc' ? targetId : null,
      to_specialist_id: type === 'specialist' ? targetId : null,
      patient_name: patientName,
      note: note || null,
      referral_type: type,
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      setPatientName('')
      setNote('')
      setTargetId('')
      setSearch('')
      router.refresh()
    }
    setSaving(false)
  }

  const inputClass =
    'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5 max-w-2xl">
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
          {strings.referrals.sent}
        </p>
      )}

      <div>
        <label className={labelClass}>{strings.referrals.referralType}</label>
        <div className="flex gap-3">
          {(['dpc', 'specialist'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => { setType(t); setTargetId(''); setSearch('') }}
              className={`px-4 py-2 text-sm rounded-lg border font-medium transition-colors ${
                type === t
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {t === 'dpc' ? strings.referrals.dpcProvider : strings.referrals.specialist}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass}>
          {type === 'dpc' ? strings.referrals.searchDpc : strings.referrals.searchSpecialists}
        </label>
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setTargetId('') }}
          placeholder={type === 'dpc' ? strings.referrals.searchDpcPlaceholder : strings.referrals.searchSpecialistsPlaceholder}
          className={inputClass}
        />
        {search && !targetId && (
          <div className="mt-1 border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-100 max-h-52 overflow-y-auto">
            {(type === 'dpc' ? filteredDpc : filteredSpecialists).length === 0 ? (
              <p className="px-4 py-3 text-sm text-gray-400">{strings.referrals.noResults}</p>
            ) : (
              (type === 'dpc' ? filteredDpc : filteredSpecialists).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setTargetId(item.id)
                    setSearch(item.name)
                  }}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900">{item.name}</span>
                  <span className="text-gray-400 ml-2">
                    {type === 'dpc'
                      ? [(item as Provider).city, (item as Provider).state].filter(Boolean).join(', ')
                      : (item as Specialist).specialty}
                  </span>
                </button>
              ))
            )}
          </div>
        )}
        {targetId && (
          <p className="mt-1.5 text-xs text-green-600 font-medium">{strings.referrals.selected}</p>
        )}
      </div>

      <div>
        <label className={labelClass}>{strings.referrals.patientName}</label>
        <input
          type="text"
          required
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>{strings.referrals.note}</label>
        <textarea
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={strings.referrals.notePlaceholder}
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
      >
        {saving ? strings.referrals.sending : strings.referrals.send}
      </button>
    </form>
  )
}

function Inbox({ inbox }: { inbox: Referral[] }) {
  if (inbox.length === 0) {
    return (
      <p className="text-gray-400 text-sm py-8 text-center">
        {strings.referrals.noReferrals}
      </p>
    )
  }

  return (
    <div className="space-y-4 max-w-2xl">
      {inbox.map((referral) => (
        <div
          key={referral.id}
          className="bg-white rounded-xl border border-gray-200 p-5"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-gray-900 text-sm">
              {referral.patient_name}
            </span>
            <span className="text-xs text-gray-400">
              {new Date(referral.created_at).toLocaleDateString()}
            </span>
          </div>
          {referral.from_provider && (
            <p className="text-xs text-gray-500 mb-2">
              {strings.referrals.from}{' '}
              <span className="text-gray-700 font-medium">
                {referral.from_provider.name}
              </span>
              {referral.from_provider.city && (
                <span className="text-gray-400">
                  {' '}— {[referral.from_provider.city, referral.from_provider.state].filter(Boolean).join(', ')}
                </span>
              )}
            </p>
          )}
          {referral.note && (
            <p className="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
              {referral.note}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
