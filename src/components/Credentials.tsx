import { useState } from 'react'
import { usePortfolio } from '../context/PortfolioContext'
import Band from './Band'
import Reveal from './Reveal'

export default function Credentials() {
  const { data } = usePortfolio()
  const { education, certifications } = data
  const [selectedImage, setSelectedImage] = useState<{ src: string; title: string; alt?: string } | null>(null)

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
            <span className="credential-index label">01 / {certifications.length + 1}</span>
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
            key={certification.id || certification.title}
            delay={(i + 1) * 90}
            className="credential-card panel panel-hover flex flex-col gap-4 p-6 sm:p-8"
          >
            <div className="credential-card-heading">
              <span className="chip">{certification.issuer}</span>
              <span className="credential-index label">
                {String(i + 2).padStart(2, '0')} / {String(certifications.length + 1).padStart(2, '0')}
              </span>
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
              <button
                type="button"
                className="group relative block w-full overflow-hidden rounded-panel border border-white/10 bg-black/20 text-left focus-visible:outline-offset-4 cursor-pointer"
                onClick={() =>
                  setSelectedImage({
                    src: certification.image!,
                    title: certification.title,
                    alt: certification.imageAlt,
                  })
                }
              >
                <img
                  alt={certification.imageAlt ?? certification.title}
                  className="credential-preview block aspect-[16/7] w-full object-cover transition duration-700 ease-out group-hover:scale-[1.025]"
                  loading="lazy"
                  src={certification.image}
                />
                <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 pb-3 pt-10 font-mono text-[0.625rem] uppercase tracking-[0.08em] text-white/90">
                  <span>View certificate</span>
                  <span aria-hidden="true" className="text-base leading-none">🔍</span>
                </span>
              </button>
            ) : null}
          </Reveal>
        ))}
      </div>

      {/* Interactive Certificate Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-[fade-in_200ms_ease-out]"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl border border-white/20 bg-[#090d1a] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <h4 className="font-display text-sm font-bold text-ink truncate pr-4">
                {selectedImage.title}
              </h4>
              <button
                onClick={() => setSelectedImage(null)}
                className="rounded-lg border border-white/10 px-2.5 py-1 font-mono text-xs text-muted hover:bg-white/10 hover:text-ink transition-colors cursor-pointer"
              >
                Close ✕
              </button>
            </div>
            <div className="p-2 sm:p-4 bg-black/50 flex items-center justify-center max-h-[75vh] overflow-auto">
              <img
                src={selectedImage.src}
                alt={selectedImage.alt || selectedImage.title}
                className="max-h-[70vh] w-auto max-w-full rounded-lg object-contain shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </Band>
  )
}
