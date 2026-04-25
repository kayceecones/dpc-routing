'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Provider } from '@/types'

export default function ProfileForm({ provider }: { provider: Provider }) {
  const router = useRouter()
  const [form, setForm] = useState({
    name: provider.name ?? '',
    bio: provider.bio ?? '',
    city: provider.city ?? '',
    state: provider.state ?? '',
    zip: provider.zip ?? '',
    phone: provider.phone ?? '',
    email: provider.email ?? '',
    website: provider.website ?? '',
    monthly_cost: provider.monthly_cost?.toString() ?? '',
    enrollment_fee: provider.enrollment_fee?.toString() ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setSuccess(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase
      .from('providers')
      .update({
        name: form.name,
        bio: form.bio || null,
        city: form.city || null,
        state: form.state || null,
        zip: form.zip || null,
        phone: form.phone || null,
        email: form.email || null,
        website: form.website || null,
        monthly_cost: form.monthly_cost ? parseFloat(form.monthly_cost) : null,
        enrollment_fee: form.enrollment_fee ? parseFloat(form.enrollment_fee) : null,
      })
      .eq('id', provider.id)

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
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
          Profile saved.
        </p>
      )}

      <div>
        <label className={labelClass}>Name *</label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Bio</label>
        <textarea
          rows={4}
          value={form.bio}
          onChange={(e) => set('bio', e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>City</label>
          <input
            type="text"
            value={form.city}
            onChange={(e) => set('city', e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>State</label>
          <input
            type="text"
            maxLength={2}
            value={form.state}
            onChange={(e) => set('state', e.target.value.toUpperCase())}
            className={inputClass}
            placeholder="TX"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Zip</label>
          <input
            type="text"
            value={form.zip}
            onChange={(e) => set('zip', e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Phone</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => set('email', e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Website</label>
        <input
          type="url"
          value={form.website}
          onChange={(e) => set('website', e.target.value)}
          className={inputClass}
          placeholder="https://"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Monthly cost ($)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.monthly_cost}
            onChange={(e) => set('monthly_cost', e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Enrollment fee ($)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.enrollment_fee}
            onChange={(e) => set('enrollment_fee', e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save profile'}
        </button>
      </div>
    </form>
  )
}
