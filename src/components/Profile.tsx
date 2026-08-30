import { usePortfolio } from '../context/PortfolioContext'
import Band from './Band'
import Reveal from './Reveal'

export default function Profile() {
  const { data } = usePortfolio()
  const { profile, disciplines, languages } = data

  const currentRole = data.experience.find((r) => r.current) || data.experience[0]

  return (
    <Band
      id="profile"
      label="Profile"
      title="How I work"
      intro="Creative direction that starts with the business objective and ends with something people actually want to use."
      alt
    >
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Reveal className="panel flex flex-col gap-5 p-6 sm:p-8">
          <p className="font-display text-[1.0625rem] font-medium leading-[1.6] text-ink">
            {profile.summary}
          </p>
          <p className="text-[0.9375rem] leading-[1.8] text-muted">{profile.longBio}</p>

          <ul className="mt-2 grid gap-3 border-t border-rule pt-6 sm:grid-cols-2">
            {disciplines.map((discipline) => (
              <li key={discipline.name} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                  style={{ background: 'rgb(var(--accent))' }}
                />
                <span className="flex flex-col gap-1">
                  <span className="text-[0.9375rem] font-medium leading-none text-ink">
                    {discipline.name}
                  </span>
                  <span className="text-micro text-muted">{discipline.note}</span>
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="flex flex-col gap-6">
          <Reveal delay={90} className="panel flex flex-col gap-4 p-6 sm:p-8">
            <h3 className="label">Languages</h3>
            <ul className="flex flex-col gap-4">
              {languages.map((language) => (
                <li key={language.name} className="flex flex-col gap-2">
                  <span className="flex items-baseline justify-between gap-4">
                    <span className="text-[0.9375rem] font-medium text-ink">
                      {language.name}
                    </span>
                    <span className="label text-right">{language.level}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="h-1 w-full overflow-hidden rounded-full bg-white/10"
                  >
                    <span
                      className="block h-full rounded-full"
                      style={{
                        width: language.level === 'Native' ? '100%' : '75%',
                        background: 'rgb(var(--accent))',
                      }}
                    />
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          {currentRole && (
            <Reveal delay={150} className="panel flex flex-col gap-4 p-6 sm:p-8">
              <h3 className="label">Currently</h3>
              <p className="text-[0.9375rem] leading-[1.7] text-muted">
                {currentRole.title} at {currentRole.company}, leading creative vision and user experience.
              </p>
              <a
                href="#experience"
                className="label mt-1 inline-flex w-fit items-center gap-2 transition-colors duration-500"
                style={{ color: 'rgb(var(--accent))' }}
              >
                Full history
                <span aria-hidden="true">→</span>
              </a>
            </Reveal>
          )}
        </div>
      </div>
    </Band>
  )
}
