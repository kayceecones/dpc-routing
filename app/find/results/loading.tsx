export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="h-7 w-48 bg-gray-200 rounded-lg animate-pulse mb-2" />
        <div className="h-4 w-36 bg-gray-100 rounded animate-pulse" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="space-y-2">
                <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-28 bg-gray-100 rounded animate-pulse" />
              </div>
              <div className="h-5 w-16 bg-gray-100 rounded-full animate-pulse" />
            </div>
            <div className="h-3 w-20 bg-gray-100 rounded animate-pulse mb-3" />
            <div className="flex gap-1.5">
              <div className="h-5 w-24 bg-blue-50 rounded-full animate-pulse" />
              <div className="h-5 w-28 bg-blue-50 rounded-full animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
