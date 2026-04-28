'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { strings } from '@/lib/i18n'

export default function SignupForm({ claim }: { claim?: string }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isClaiming = Boolean(claim)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { data, error: signupError } = await supabase.auth.signUp({ email, password })

    if (signupError) {
      setError(signupError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      if (isClaiming) {
        const { error: claimError } = await supabase
          .from('providers')
          .update({ user_id: data.user.id, claimed: true })
          .eq('id', claim)
          .is('user_id', null)

        if (claimError) {
          setError(claimError.message)
          setLoading(false)
          return
        }
      } else {
        const { error: insertError } = await supabase.from('providers').insert({
          name,
          user_id: data.user.id,
          accepting_patients: true,
        })

        if (insertError) {
          setError(insertError.message)
          setLoading(false)
          return
        }
      }
    }

    router.push('/dashboard')
    router.refresh()
  }

  const inputClass =
    'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

  return (
    <div className="max-w-sm mx-auto px-4 py-20">
      <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">{strings.signup.title}</h1>
      <p className="text-center text-sm text-gray-500 mb-8">
        {isClaiming ? strings.signup.claimSubtitle : strings.signup.subtitle}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {error}
          </p>
        )}

        {!isClaiming && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{strings.signup.name}</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{strings.signup.email}</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{strings.signup.password}</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? strings.signup.submitting : strings.signup.submit}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        {strings.signup.hasAccount}{' '}
        <Link href="/login" className="text-blue-600 hover:underline">
          {strings.signup.logIn}
        </Link>
      </p>
    </div>
  )
}
