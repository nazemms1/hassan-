import { useEffect, useRef, useState } from 'react'
import { profile, sections } from '../data/portfolio'

/** Which section is currently under the reading line. */
function useActiveSection() {
  const [active, setActive] = useState('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.2, 0.6] },
    )

    sections.forEach(({ id }) => {
      const node = document.getElementById(id)
      if (node) observer.observe(node)
    })

    return () => observer.disconnect()
  }, [])

  return active
}

/** 0–1 through the document, for the progress hairline. */
function useScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      setProgress(scrollable > 0 ? window.scrollY / scrollable : 0)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return progress
}

export default function TopBar() {
  const active = useActiveSection()
  const progress = useScrollProgress()
  const [open, setOpen] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)

  // While the drawer is up: lock the page behind it and let Escape dismiss.
  useEffect(() => {
    if (!open) return

    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-rule bg-ground/80 backdrop-blur-xl">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-0.5 origin-left transition-transform duration-200"
          style={{ transform: `scaleX(${progress})`, background: 'rgb(var(--accent))' }}
        />

        <div className="mx-auto flex max-w-shell items-center justify-between gap-6 px-6 py-3.5 sm:px-10">
          <a href="#top" className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="grid h-8 w-8 place-items-center rounded-lg font-display text-[0.75rem] font-semibold transition-colors duration-500"
              style={{ background: 'rgb(var(--accent) / 0.16)', color: 'rgb(var(--accent))' }}
            >
              MA
            </span>
            <span className="font-display text-[0.9375rem] font-semibold leading-none text-ink">
              Mohamad Hassan Aljeshi
            </span>
          </a>

          <nav aria-label="Sections" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {sections.map(({ id, label }) => {
                const isActive = active === id
                return (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      aria-current={isActive ? 'true' : undefined}
                      className="nav-link label block hover:text-ink"
                      style={
                        isActive
                          ? {
                              color: 'rgb(var(--accent))',
                              background: 'rgb(var(--accent) / 0.12)',
                            }
                          : undefined
                      }
                    >
                      {label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <a href="#contact" className="btn btn-primary hidden lg:inline-flex">
              Hire me
            </a>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="label flex items-center gap-3 rounded-full border border-rule px-4 py-2.5 text-muted transition-colors duration-500 hover:text-ink lg:hidden"
            >
              Menu
              <span aria-hidden="true" className="flex w-4 flex-col gap-1">
                <span className="h-px w-full bg-current" />
                <span className="h-px w-full bg-current" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen drawer, mobile and tablet. */}
      <div
        className={`fixed inset-0 z-50 flex flex-col bg-ground transition-[opacity,visibility] duration-500 ease-seam lg:hidden ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
      >
        <div className="flex items-center justify-between border-b border-rule px-6 py-3.5 sm:px-10">
          <span className="font-display text-[0.9375rem] font-semibold leading-none text-ink">
            M. H. Aljeshi
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="label flex items-center gap-3 rounded-full border border-rule px-4 py-2.5 text-muted transition-colors duration-500 hover:text-ink"
          >
            Close
            <span aria-hidden="true" className="relative block h-3.5 w-3.5">
              <span className="absolute left-0 top-1/2 h-px w-full rotate-45 bg-current" />
              <span className="absolute left-0 top-1/2 h-px w-full -rotate-45 bg-current" />
            </span>
          </button>
        </div>

        <nav aria-label="Sections" className="flex-1 overflow-y-auto px-6 py-8 sm:px-10">
          <ul className="flex flex-col gap-2">
            {sections.map(({ id, label }, i) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={() => setOpen(false)}
                  className="panel flex items-center gap-4 px-5 py-4 transition-[opacity,transform] duration-700 ease-seam"
                  style={{
                    transitionDelay: open ? `${100 + i * 55}ms` : '0ms',
                    opacity: open ? 1 : 0,
                    transform: open ? 'translateY(0)' : 'translateY(10px)',
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="h-8 w-1 rounded-full"
                    style={{ background: 'rgb(var(--accent))' }}
                  />
                  <span className="font-display text-[1.0625rem] font-semibold leading-none text-ink">
                    {label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-3 border-t border-rule px-6 py-6 sm:px-10">
          <a href={`mailto:${profile.email}`} className="btn btn-primary justify-center">
            Start a project
          </a>
          <span className="label text-center">{profile.location}</span>
        </div>
      </div>
    </>
  )
}