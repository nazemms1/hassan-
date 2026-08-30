import { useEffect, useRef, useState } from 'react'
import { usePortfolio } from '../context/PortfolioContext'
import type { Project } from '../data/portfolio'
import Band from './Band'
import Reveal from './Reveal'

function Frame({ images, title }: { images?: string[]; title: string }) {
  if (images?.length) {
    return (
      <div className="relative h-full w-full overflow-hidden bg-white">
        <img
          src={images[0]}
          alt={title}
          loading="lazy"
          className="h-full w-full object-contain transition-transform duration-[1200ms] ease-seam group-hover:scale-[1.03]"
        />
        {images.length > 1 ? (
          <span className="absolute bottom-3 right-3 rounded-full border border-black/10 bg-white/90 px-3 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-black/65 shadow-sm">
            {images.length} images
          </span>
        ) : null}
      </div>
    )
  }

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

function ProjectModal({
  project,
  onClose,
}: {
  project: Project
  onClose: () => void
}) {
  const [activeImage, setActiveImage] = useState(0)
  const images = project.images ?? []

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft' && images.length > 1) {
        setActiveImage((current) => (current - 1 + images.length) % images.length)
      }
      if (event.key === 'ArrowRight' && images.length > 1) {
        setActiveImage((current) => (current + 1) % images.length)
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [images.length, onClose])

  useEffect(() => {
    if (images.length < 2) return

    const slideshow = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % images.length)
    }, 4500)

    return () => window.clearInterval(slideshow)
  }, [images.length])

  const showPrevious = () => {
    setActiveImage((current) => (current - 1 + images.length) % images.length)
  }

  const showNext = () => {
    setActiveImage((current) => (current + 1) % images.length)
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[rgb(var(--ground)/0.9)] p-2 backdrop-blur-md sm:p-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        className="panel enter max-h-[min(900px,94vh)] w-full max-w-6xl overflow-y-auto rounded-[1.25rem] border-white/15"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
      >
        <div className="flex items-start justify-between gap-4 border-b border-rule bg-white/[0.025] p-5 sm:p-8">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <p className="label">Selected work</p>
              <span className="h-px w-8 bg-[rgb(var(--accent))]" aria-hidden="true" />
              <p className="label">{project.year}</p>
            </div>
            <h2 id="project-modal-title" className="font-display text-2xl font-semibold leading-tight text-ink sm:text-4xl">
              {project.title}
            </h2>
            <p className="mt-2 text-sm text-muted">{project.client} / {project.discipline}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-rule text-xl text-muted transition-all hover:border-[rgb(var(--accent)/0.5)] hover:bg-[rgb(var(--accent)/0.1)] hover:text-ink"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div className="grid gap-8 p-4 sm:p-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(260px,0.65fr)]">
          <div className="flex flex-col gap-4">
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-rule bg-white shadow-2xl shadow-black/30">
              {images.length ? (
                <img
                  key={images[activeImage]}
                  src={images[activeImage]}
                  alt={`${project.title} ${activeImage + 1}`}
                  className="h-full w-full animate-[rise_450ms_ease-out] object-contain"
                />
              ) : (
                <Frame title={project.title} />
              )}

              {images.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={showPrevious}
                    aria-label="Previous project image"
                    className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/55 text-xl text-white shadow-lg transition-all hover:scale-105 hover:bg-black/80"
                  >
                    <span aria-hidden="true">←</span>
                  </button>
                  <button
                    type="button"
                    onClick={showNext}
                    aria-label="Next project image"
                    className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/55 text-xl text-white shadow-lg transition-all hover:scale-105 hover:bg-black/80"
                  >
                    <span aria-hidden="true">→</span>
                  </button>
                  <p className="label absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/65 px-3 py-1.5 text-white">
                    {String(activeImage + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
                  </p>
                </>
              ) : null}
            </div>

            {images.length > 1 ? (
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                {images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    aria-label={`Show image ${index + 1}`}
                    className={`aspect-[4/3] overflow-hidden rounded-md border bg-white p-0.5 transition-all hover:-translate-y-0.5 ${index === activeImage ? 'border-[rgb(var(--accent))] ring-2 ring-[rgb(var(--accent)/0.2)]' : 'border-rule opacity-65 hover:border-muted hover:opacity-100'}`}
                  >
                    <img src={image} alt="" className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-7 lg:border-l lg:border-rule lg:pl-8">
            <div>
              <p className="label mb-3">About the project</p>
              <p className="text-[0.9375rem] leading-[1.8] text-muted">{project.description}</p>
            </div>
            <div className="border-t border-rule pt-6">
              <p className="label mb-3">My contribution</p>
              <ul className="flex flex-wrap gap-2">
                {project.contribution.map((item) => (
                  <li key={item} className="label rounded-full border border-rule px-2.5 py-1.5 text-muted">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function Work() {
  const { data } = usePortfolio()
  const visibleProjects = data.projects.filter((p) => !p.hidden)

  const trackRef = useRef<HTMLDivElement>(null)
  const dragStartX = useRef(0)
  const dragStartScrollLeft = useRef(0)
  const isDragging = useRef(false)
  const didDrag = useRef(false)
  const suppressNextClick = useRef(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const nudge = (direction: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    const card = track.firstElementChild as HTMLElement | null
    const step = card ? card.offsetWidth + 24 : track.clientWidth * 0.8
    track.scrollBy({ left: step * direction, behavior: 'smooth' })
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return

    const track = trackRef.current
    if (!track) return
    dragStartX.current = event.clientX
    dragStartScrollLeft.current = track.scrollLeft
    isDragging.current = true
    didDrag.current = false
    suppressNextClick.current = false
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return

    const track = trackRef.current
    if (!track) return
    const distance = event.clientX - dragStartX.current
    if (Math.abs(distance) > 8) didDrag.current = true
    if (didDrag.current) track.scrollLeft = dragStartScrollLeft.current - distance
  }

  const stopDragging = () => {
    if (!isDragging.current) return
    suppressNextClick.current = didDrag.current
    isDragging.current = false
    didDrag.current = false
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
            {visibleProjects.length} projects — drag or use the arrows
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
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={stopDragging}
            onPointerCancel={stopDragging}
            onClickCapture={(event) => {
              if (suppressNextClick.current) {
                event.preventDefault()
                event.stopPropagation()
                suppressNextClick.current = false
              }
            }}
            className={`no-scrollbar -mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-2 touch-pan-x sm:-mx-10 sm:px-10 ${isDragging.current ? 'cursor-grabbing' : 'cursor-grab'}`}
          >
            {visibleProjects.map((project) => (
              <article
                key={project.id || project.title}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedProject(project)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    setSelectedProject(project)
                  }
                }}
                className="panel panel-hover group flex w-[min(88vw,380px)] shrink-0 snap-start flex-col overflow-hidden"
              >
                <div className="aspect-[4/3] overflow-hidden border-b border-rule">
                  <Frame images={project.images} title={project.title} />
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

                  <p className="line-clamp-3 text-[0.9375rem] leading-[1.7] text-muted">
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

                </div>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
      {selectedProject ? (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      ) : null}
    </Band>
  )
}
