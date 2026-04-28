import type { Provider } from '@/types'

export const BUDGET_MAX: Record<string, number | undefined> = {
  under50: 49,
  '50to80': 80,
  '80to100': 100,
  any: undefined,
}

const NEED_KEYWORDS: Record<string, string[]> = {
  chronic: ['chronic', 'diabetes', 'hypertension', 'condition', 'management'],
  uninsured: ['uninsured', 'insurance', 'cash', 'membership'],
  preventive: ['preventive', 'wellness', 'checkup', 'prevention', 'annual'],
  family: ['family', 'pediatric', 'children', 'kids', 'child'],
  unsure: [],
}

const NEED_REASONS: Record<string, string> = {
  chronic: 'Manages chronic conditions',
  uninsured: 'Accepts uninsured patients',
  preventive: 'Preventive care',
  family: 'Family care',
}

export function matchProviders(
  providers: Provider[],
  filters: {
    location?: string
    maxCost?: number
    needs?: string[]
  }
): Array<Provider & { matchReasons: string[]; score: number }> {
  const scored = providers.map((provider) => {
    const matchReasons: string[] = []
    let score = 0

    if (filters.location) {
      const q = filters.location.toLowerCase().trim()
      const stateMatch = q.length === 2 && provider.state?.toLowerCase() === q
      const cityMatch = provider.city?.toLowerCase().includes(q)
      const zipMatch = provider.zip?.toLowerCase() === q

      if (stateMatch || cityMatch || zipMatch) {
        score += 2
        matchReasons.push('In your area')
      }
    }

    if (filters.maxCost != null && provider.monthly_cost != null) {
      if (provider.monthly_cost <= filters.maxCost) {
        score += 2
        matchReasons.push('Within your budget')
      }
    }

    if (filters.needs && filters.needs.length > 0) {
      const bio = (provider.bio ?? '').toLowerCase()
      for (const need of filters.needs) {
        const keywords = NEED_KEYWORDS[need] ?? []
        const matched = need === 'unsure' || keywords.some((kw) => bio.includes(kw))
        if (matched) {
          score += 1
          const label = NEED_REASONS[need]
          if (label) matchReasons.push(label)
        }
      }
    }

    return { ...provider, matchReasons, score }
  })

  return scored.sort((a, b) => b.score - a.score)
}
