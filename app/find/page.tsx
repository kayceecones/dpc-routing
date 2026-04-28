'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { strings } from '@/lib/i18n'

const BUDGET_OPTIONS = [
  { label: strings.intake.step2.options.under50, value: 'under50' },
  { label: strings.intake.step2.options['50to80'], value: '50to80' },
  { label: strings.intake.step2.options['80to100'], value: '80to100' },
  { label: strings.intake.step2.options.any, value: 'any' },
]

const NEED_OPTIONS = [
  { label: strings.intake.step3.options.chronic, value: 'chronic' },
  { label: strings.intake.step3.options.uninsured, value: 'uninsured' },
  { label: strings.intake.step3.options.preventive, value: 'preventive' },
  { label: strings.intake.step3.options.family, value: 'family' },
  { label: strings.intake.step3.options.unsure, value: 'unsure' },
]

const TOTAL_STEPS = 3

export default function FindPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [location, setLocation] = useState('')
  const [budget, setBudget] = useState('')
  const [needs, setNeeds] = useState<string[]>([])

  function next() {
    setStep((s) => s + 1)
  }

  function back() {
    setStep((s) => s - 1)
  }

  function toggleNeed(value: string) {
    setNeeds((prev) =>
      prev.includes(value) ? prev.filter((n) => n !== value) : [...prev, value]
    )
  }

  function submit() {
    const params = new URLSearchParams()
    if (location) params.set('location', location)
    if (budget) params.set('budget', budget)
    if (needs.length > 0) params.set('needs', needs.join(','))
    router.push(`/find/results?${params.toString()}`)
  }

  const pillBase =
    'px-4 py-2 rounded-full text-sm border font-medium transition-colors'
  const pillActive = 'bg-blue-600 border-blue-600 text-white'
  const pillInactive = 'bg-white border-gray-300 text-gray-700 hover:border-blue-300'

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Progress */}
        <div className="mb-8">
          <p className="text-xs text-gray-400 text-center mb-3">
            {strings.intake.stepOf(step, TOTAL_STEPS)}
          </p>
          <div className="flex gap-1.5">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i < step ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1 — Location */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
              {strings.intake.step1.question}
            </h2>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={strings.intake.step1.placeholder}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && location.trim() && next()}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
            />
            <button
              onClick={next}
              disabled={!location.trim()}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-40"
            >
              {strings.intake.next}
            </button>
          </div>
        )}

        {/* Step 2 — Budget */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
              {strings.intake.step2.question}
            </h2>
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {BUDGET_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setBudget(opt.value)}
                  className={`${pillBase} ${budget === opt.value ? pillActive : pillInactive}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={back}
                className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50"
              >
                {strings.intake.back}
              </button>
              <button
                onClick={next}
                disabled={!budget}
                className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-40"
              >
                {strings.intake.next}
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Needs */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
              {strings.intake.step3.question}
            </h2>
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {NEED_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => toggleNeed(opt.value)}
                  className={`${pillBase} ${needs.includes(opt.value) ? pillActive : pillInactive}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={back}
                className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50"
              >
                {strings.intake.back}
              </button>
              <button
                onClick={submit}
                className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                {strings.intake.findProviders}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
