import { certifications, education } from '../data/portfolio'
import Band from './Band'
import Reveal from './Reveal'


export default function Credentials() {
  return (
    <Band
      id="credentials"
      label="Credentials"
      title="Education, Certifications & Recognition"
      intro="A software engineering degree, professional UX certifications, and recognition for creative contribution."
    >
      <div className="credentials-grid grid gap-5 md:grid-cols-2">
        <Reveal className="credential-card panel panel-hover flex flex-col gap-4 p-6 sm:p-8">
          <div className="credential-card-heading">
            <span className="chip w-fit">Degree</span>
            <span className="credential-index label">01 / 04</span>
          </div>
          <h3 className="font-display text-[1.125rem] font-semibold leading-snug text-ink">
            {education.degree}
          </h3>
          <p className="text-[0.9375rem] text-muted">{education.school}</p>
          <p className="credential-date label mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-4">
            <span>{education.period}</span>
            <span aria-hidden="true" className="h-px w-5 bg-rule" />
            <span>{education.detail}</span>
          </p>
        </Reveal>

        {certifications.map((certification, i) => (
          <Reveal
            key={certification.title}
            delay={(i + 1) * 90}
            className="credential-card panel panel-hover flex flex-col gap-4 p-6 sm:p-8"
          >
              <div className="credential-card-heading">
                <span className="chip">{certification.issuer}</span>
                <span className="credential-index label">0{i + 2} / 04</span>
              </div>

              <h3 className="font-display text-[1.125rem] font-semibold leading-snug text-ink">
                {certification.title}
              </h3>
              <p className="text-[0.9375rem] leading-[1.75] text-muted">
                {certification.description}
              </p>

              <p className="credential-date label mt-auto flex items-center gap-3 pt-2">
                <span className="h-px w-5 bg-rule" aria-hidden="true" />
                <span>{certification.date}</span>
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
                    className="credential-preview block aspect-[16/7] w-full object-cover transition duration-700 ease-out group-hover:scale-[1.025]"
                    loading="lazy"
                    src={certification.image}
                  />
                  <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/75 via-black/30 to-transparent px-4 pb-3 pt-10 font-mono text-[0.625rem] uppercase tracking-[0.08em] text-white/90">
                    <span>View certificate</span>
                    <span aria-hidden="true" className="text-base leading-none">↗</span>
                  </span>
                </a>
              ) : null}

          </Reveal>
        ))}
      </div>
    </Band>
  )
}
