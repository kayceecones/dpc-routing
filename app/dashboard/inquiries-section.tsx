'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Inquiry } from '@/types'
import { strings } from '@/lib/i18n'

export default function InquiriesSection({
  initialInquiries,
}: {
  initialInquiries: Inquiry[]
}) {
  const [inquiries, setInquiries] = useState(initialInquiries)
  const router = useRouter()

  async function markRead(id: string) {
    const supabase = createClient()
    await supabase.from('patient_inquiries').update({ read: true }).eq('id', id)
    setInquiries((prev) =>
      prev.map((i) => (i.id === id ? { ...i, read: true } : i))
    )
    router.refresh()
  }

  const unreadCount = inquiries.filter((i) => !i.read).length

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {strings.inquiries.heading}
        </h2>
        {unreadCount > 0 && (
          <span className="text-xs bg-red-100 text-red-600 font-medium px-2 py-0.5 rounded-full">
            {strings.inquiries.unread(unreadCount)}
          </span>
        )}
      </div>

      {inquiries.length === 0 ? (
        <p className="text-sm text-gray-500">{strings.inquiries.noInquiries}</p>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className={`bg-white rounded-xl border p-4 ${
                inquiry.read ? 'border-gray-100 opacity-70' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {inquiry.patient_name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{inquiry.patient_email}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-gray-400">
                    {new Date(inquiry.created_at).toLocaleDateString()}
                  </span>
                  {!inquiry.read && (
                    <button
                      onClick={() => markRead(inquiry.id)}
                      className="text-xs text-blue-600 hover:underline font-medium"
                    >
                      {strings.inquiries.markRead}
                    </button>
                  )}
                </div>
              </div>
              {inquiry.message && (
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  {inquiry.message.length > 100
                    ? `${inquiry.message.slice(0, 100)}…`
                    : inquiry.message}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
