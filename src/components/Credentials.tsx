import { certifications, education } from '../data/portfolio'
import Band from './Band'
import Reveal from './Reveal'


export default function Credentials() {
  return (
    <Band
      id="credentials"
      label="Credentials"
      title="Education & training"
      intro="A software engineering degree, plus formal UX training from DTC and Google."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <Reveal className="panel panel-hover flex flex-col gap-4 p-6 sm:p-8">
          <span className="chip w-fit">Degree</span>
          <h3 className="font-display text-[1.125rem] font-semibold leading-snug text-ink">
            {education.degree}
          </h3>
          <p className="text-[0.9375rem] text-muted">{education.school}</p>
          <p className="label mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-4">
            <span>{education.period}</span>
            <span aria-hidden="true" className="h-px w-5 bg-rule" />
            <span>{education.detail}</span>
          </p>
        </Reveal>

        <div className="flex flex-col gap-6">
          {certifications.map((certification, i) => (
            <Reveal
              key={certification.title}
              delay={(i + 1) * 90}
              className="panel panel-hover flex flex-col gap-4 p-6 sm:p-8"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="chip">{certification.issuer}</span>
              </div>

              <h3 className="font-display text-[1.125rem] font-semibold leading-snug text-ink">
                {certification.title}
              </h3>
              <p className="text-[0.9375rem] leading-[1.75] text-muted">
                {certification.description}
              </p>

              {certification.image ? (
                <a
                  className="group relative block overflow-hidden rounded-panel border border-white/10 bg-black/20 focus-visible:outline-offset-4"
                  href={certification.image}
                  rel="noreferrer"
                  target="_blank"
                >
                  <img
                    alt={certification.imageAlt ?? certification.title}
                    className="block aspect-[1280/904] w-full object-cover transition duration-700 ease-out group-hover:scale-[1.025]"
                    loading="lazy"
                    src={certification.image}
                  />
                  <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/75 via-black/30 to-transparent px-4 pb-3 pt-10 font-mono text-[0.625rem] uppercase tracking-[0.08em] text-white/90">
                    <span>View certificate</span>
                    <span aria-hidden="true" className="text-base leading-none">↗</span>
                  </span>
                </a>
              ) : null}

              {certification.modules ? (
                <ul className="grid gap-2.5 border-t border-rule pt-5 sm:grid-cols-2">
                  {certification.modules.map((module) => (
                    <li key={module} className="flex gap-2.5">
                      <span
                        aria-hidden="true"
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: 'rgb(var(--accent) / 0.7)' }}
                      />
                      <span className="text-micro text-muted">{module}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </Reveal>
          ))}
        </div>
      </div>
    </Band>
  )
}
