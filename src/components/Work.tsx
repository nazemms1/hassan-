import { useRef } from 'react'
import { projects } from '../data/portfolio'
import Band from './Band'
import Reveal from './Reveal'


function Frame({ image, title }: { image?: string; title: string }) {
  if (image) {
    return (
      <img
        src={image}
        alt={title}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-[1200ms] ease-seam group-hover:scale-[1.05]"
      />
    )
  }

  // No image supplied — an honest empty frame rather than a fake mockup.
  return (
    <div
      className="grid h-full w-full place-items-center"
      style={{
        background:
          'repeating-linear-gradient(135deg, rgb(var(--accent) / 0.05) 0 12px, transparent 12px 24px), rgb(255 255 255 / 0.04)',
      }}
    >
      <span className="label">Image to come</span>
    </div>
  )
}

export default function Work() {
  const trackRef = useRef<HTMLDivElement>(null)

  const nudge = (direction: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    const card = track.firstElementChild as HTMLElement | null
    const step = card ? card.offsetWidth + 24 : track.clientWidth * 0.8
    track.scrollBy({ left: step * direction, behavior: 'smooth' })
  }

  return (
    <Band
      id="work"
      label="Selected work"
      title="Case studies"
      intro="Projects led end to end — research and flows through to interface, identity, and the system that holds it together."
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <span className="label">
            {projects.length} projects — drag or use the arrows
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => nudge(-1)}
              aria-label="Previous project"
              className="grid h-10 w-10 place-items-center rounded-full border border-rule text-muted transition-colors duration-500 hover:border-[rgb(var(--accent)/0.5)] hover:text-ink"
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              onClick={() => nudge(1)}
              aria-label="Next project"
              className="grid h-10 w-10 place-items-center rounded-full border border-rule text-muted transition-colors duration-500 hover:border-[rgb(var(--accent)/0.5)] hover:text-ink"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        <Reveal>
          <div
            ref={trackRef}
            className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-2 sm:-mx-10 sm:px-10"
          >
            {projects.map((project) => (
              <article
                key={project.title}
                className="panel panel-hover group flex w-[min(88vw,380px)] shrink-0 snap-start flex-col overflow-hidden"
              >
                <div className="aspect-[4/3] overflow-hidden border-b border-rule">
                  <Frame image={project.image} title={project.title} />
                </div>

                <div className="flex flex-1 flex-col gap-4 p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="chip">{project.discipline}</span>
                    <span className="label">{project.year}</span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <h3 className="font-display text-[1.125rem] font-semibold leading-tight text-ink">
                      {project.title}
                    </h3>
                    <p className="label normal-case tracking-normal text-muted">
                      {project.client}
                    </p>
                  </div>

                  <p className="text-[0.9375rem] leading-[1.7] text-muted">
                    {project.description}
                  </p>

                  <ul className="mt-auto flex flex-wrap gap-2 pt-2">
                    {project.contribution.map((item) => (
                      <li
                        key={item}
                        className="label rounded-full border border-rule px-2.5 py-1.5 text-muted"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>

                  {project.placeholder ? (
                    <p className="label border-t border-dashed border-rule pt-4">
                      Placeholder — real case study to be added
                    </p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </Band>
  )
}
