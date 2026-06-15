import type { CriteriaItem } from '../../types/candidate'
import { criteriaRowClasses, criteriaIcons } from '../../utils/helpers'

interface CriteriaSectionProps {
  criteria: CriteriaItem[]
}

export function CriteriaSection({ criteria }: CriteriaSectionProps) {
  return (
    <section aria-labelledby="criteria-heading">
      <h2 id="criteria-heading" className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        Критерии оценки
      </h2>
      <ul className="space-y-2">
        {criteria.map(([status, text], i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              className={`mt-0.5 text-sm font-bold w-4 shrink-0 ${criteriaRowClasses[status]}`}
              aria-label={status === 'ok' ? 'Соответствует' : status === 'partial' ? 'Частично' : 'Не соответствует'}
            >
              {criteriaIcons[status]}
            </span>
            <span className="text-sm text-gray-700 leading-snug">{text}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
