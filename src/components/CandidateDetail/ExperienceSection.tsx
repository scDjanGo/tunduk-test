import type { ExpItem } from '../../types/candidate'

interface ExperienceSectionProps {
  exp: ExpItem[]
  totalExp: string
}

export function ExperienceSection({ exp, totalExp }: ExperienceSectionProps) {
  return (
    <section aria-labelledby="exp-heading">
      <h2 id="exp-heading" className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
        Опыт работы
        <span className="normal-case font-normal text-gray-400">({totalExp})</span>
      </h2>
      <ol className="relative border-l-2 border-gray-100 ml-2 space-y-4">
        {exp.map(([period, company, role, duration], i) => (
          <li key={i} className="ml-4">
            <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-blue-200 border-2 border-white" />
            <p className="font-medium text-sm text-gray-900">{role}</p>
            <p className="text-sm text-blue-600">{company}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {period} · {duration}
            </p>
          </li>
        ))}
      </ol>
    </section>
  )
}
