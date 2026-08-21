import type { ReactNode } from 'react'
import Reveal from './Reveal'

type Props = {
  id: string
  label: string
  title: string
  intro?: string
  /** Alternate ground, so consecutive bands separate without a hard rule. */
  alt?: boolean
  children: ReactNode
}

/**
 * A section chapter. Lays two blurred orbs behind the content so the glass
 * panes on top have real colour to pick up, and opens with a quiet header.
 */
export default function Band({ id, label, title, intro, alt, children }: Props) {
  return (
    <section
      id={id}
      className={`relative scroll-mt-20 overflow-hidden ${alt ? 'bg-band' : 'bg-ground'}`}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span
          className="orb h-[420px] w-[420px] opacity-[0.26]"
          style={{ background: 'rgb(var(--accent))', top: '-150px', left: '-120px' }}
        />
        <span
          className="orb h-[340px] w-[340px] opacity-[0.13]"
          style={{ background: 'rgb(var(--accent))', bottom: '-150px', right: '-90px' }}
        />
      </div>

      <div className="relative mx-auto max-w-shell px-6 py-20 sm:px-10 lg:py-28">
        <Reveal>
          <header className="mb-12 flex max-w-3xl flex-col gap-4 lg:mb-16">
            <span className="label flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: 'rgb(var(--accent))' }}
              />
              {label}
            </span>

            <h2 className="font-display text-[clamp(1.5rem,2.6vw,2rem)] font-semibold leading-tight text-ink">
              {title}
            </h2>

            {intro ? <p className="prose-measure">{intro}</p> : null}
          </header>
        </Reveal>

        {children}
      </div>
    </section>
  )
}
