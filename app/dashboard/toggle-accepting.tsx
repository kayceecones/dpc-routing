'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ToggleAccepting({
  providerId,
  accepting,
}: {
  providerId: string
  accepting: boolean
}) {
  const [value, setValue] = useState(accepting)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function toggle() {
    setLoading(true)
    const supabase = createClient()
    await supabase
      .from('providers')
      .update({ accepting_patients: !value })
      .eq('id', providerId)
    setValue(!value)
    setLoading(false)
    router.refresh()
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors disabled:opacity-60 ${
        value
          ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full ${value ? 'bg-green-500' : 'bg-gray-400'}`}
      />
      {value ? 'Accepting patients' : 'Full — click to open'}
    </button>
  )
}
