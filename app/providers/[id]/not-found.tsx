import Link from 'next/link'
import { strings } from '@/lib/i18n'

export default function ProviderNotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-3">
        {strings.emptyStates.providerNotFound.heading}
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        {strings.emptyStates.providerNotFound.subheading}
      </p>
      <Link
        href="/find"
        className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700"
      >
        {strings.emptyStates.providerNotFound.cta}
      </Link>
    </div>
  )
}
