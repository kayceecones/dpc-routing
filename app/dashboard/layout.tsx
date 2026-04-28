import Link from 'next/link'
import { strings } from '@/lib/i18n'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let unreadCount = 0
  if (user) {
    const { data: provider } = await supabase
      .from('providers')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (provider) {
      const { count } = await supabase
        .from('patient_inquiries')
        .select('*', { count: 'exact', head: true })
        .eq('provider_id', provider.id)
        .eq('read', false)

      unreadCount = count ?? 0
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="flex gap-1 mb-8 border-b border-gray-200 pb-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-md hover:bg-gray-100"
        >
          {strings.dashboardNav.overview}
          {unreadCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 text-xs bg-red-500 text-white rounded-full px-1 leading-none">
              {unreadCount}
            </span>
          )}
        </Link>
        <Link
          href="/dashboard/profile"
          className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-md hover:bg-gray-100"
        >
          {strings.dashboardNav.profile}
        </Link>
        <Link
          href="/dashboard/referrals"
          className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-md hover:bg-gray-100"
        >
          {strings.dashboardNav.referrals}
        </Link>
      </nav>
      {children}
    </div>
  )
}
