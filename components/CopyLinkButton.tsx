'use client'

import { useState } from 'react'

export default function CopyLinkButton({
  label,
  copiedLabel,
}: {
  label: string
  copiedLabel: string
}) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="text-blue-600 hover:underline font-medium transition-colors"
    >
      {copied ? copiedLabel : label}
    </button>
  )
}
