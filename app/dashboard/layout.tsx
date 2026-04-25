import Link from 'next/link'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="flex gap-1 mb-8 border-b border-gray-200 pb-4">
        <Link
          href="/dashboard"
          className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-md hover:bg-gray-100"
        >
          Overview
        </Link>
        <Link
          href="/dashboard/profile"
          className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-md hover:bg-gray-100"
        >
          Profile
        </Link>
        <Link
          href="/dashboard/referrals"
          className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-md hover:bg-gray-100"
        >
          Referrals
        </Link>
      </nav>
      {children}
    </div>
  )
}
