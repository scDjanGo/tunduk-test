import type { Candidate } from '../../types/candidate'
import { VerdictBadge } from '../StatusBadge'
import { Toast } from '../UI/Toast'
import { useToast } from '../../hooks/useToast'
import { ContactInfo } from './ContactInfo'
import { ExperienceSection } from './ExperienceSection'
import { CriteriaSection } from './CriteriaSection'
import { StatusSelect } from './StatusSelect'

interface CandidateDetailProps {
  candidate: Candidate
}

export function CandidateDetail({ candidate }: CandidateDetailProps) {
  const { toast, showToast, hideToast } = useToast()

  return (
    <>
      <article className="max-w-3xl mx-auto space-y-8">
        <header className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex flex-wrap items-start gap-3 justify-between mb-1">
            <h1 className="text-2xl font-bold text-gray-900">{candidate.name}</h1>
            <VerdictBadge verdict={candidate.verdict} vc={candidate.vc} />
          </div>
          <p className="text-gray-500 text-sm mb-4">{candidate.pos_label}</p>

          <div className="pt-4 border-t border-gray-100">
            <StatusSelect
              candidateId={candidate.id}
              currentStatus={candidate.status}
              onToast={showToast}
            />
          </div>
        </header>

        <section className="bg-white border border-gray-200 rounded-xl p-6">
          <ContactInfo candidate={candidate} />
        </section>

        <section className="bg-white border border-gray-200 rounded-xl p-6">
          <ExperienceSection exp={candidate.exp} totalExp={candidate.total_exp} />
        </section>

        <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Стек технологий</h2>
            <div className="flex flex-wrap gap-1.5">
              {candidate.stack.split(',').map((tech) => (
                <span
                  key={tech.trim()}
                  className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs rounded-md"
                >
                  {tech.trim()}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Образование</h2>
            <p className="text-sm text-gray-700">{candidate.edu}</p>
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-xl p-6">
          <CriteriaSection criteria={candidate.criteria} />
        </section>

        <section className="bg-white border border-gray-200 rounded-xl p-6" aria-labelledby="summary-heading">
          <h2 id="summary-heading" className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Summary
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">{candidate.summary}</p>
        </section>

        <section className="bg-white border border-gray-200 rounded-xl p-6" aria-labelledby="questions-heading">
          <h2 id="questions-heading" className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Вопросы для собеседования
          </h2>
          <ol className="space-y-2 list-decimal list-inside">
            {candidate.questions.map((q, i) => (
              <li key={i} className="text-sm text-gray-700 leading-snug">
                {q}
              </li>
            ))}
          </ol>
        </section>
      </article>

      <Toast toast={toast} onClose={hideToast} />
    </>
  )
}
