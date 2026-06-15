import type { Candidate } from '../../types/candidate'

interface ContactInfoProps {
  candidate: Candidate
}

export function ContactInfo({ candidate }: ContactInfoProps) {
  return (
    <section aria-labelledby="contacts-heading">
      <h2 id="contacts-heading" className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        Контакты
      </h2>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <dt className="text-xs text-gray-400">Email</dt>
          <dd className="text-sm">
            <a href={`mailto:${candidate.email}`} className="text-indigo-600 hover:underline">
              {candidate.email}
            </a>
          </dd>
        </div>
        {candidate.phone && (
          <div>
            <dt className="text-xs text-gray-400">Телефон</dt>
            <dd className="text-sm text-gray-800">{candidate.phone}</dd>
          </div>
        )}
        <div>
          <dt className="text-xs text-gray-400">Город</dt>
          <dd className="text-sm text-gray-800">📍 {candidate.city}</dd>
        </div>
        <div>
          <dt className="text-xs text-gray-400">Telegram</dt>
          <dd className="text-sm">
            <a
              href={`https://t.me/${candidate.tg.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              {candidate.tg}
            </a>
          </dd>
        </div>
      </dl>
    </section>
  )
}
