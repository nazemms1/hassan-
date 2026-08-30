import { useState } from 'react'
import { usePortfolio } from '../context/PortfolioContext'
import type { Role } from '../data/portfolio'
import Band from './Band'
import Reveal from './Reveal'

const VISIBLE_POINTS = 3

function RoleCard({ role }: { role: Role }) {
  const [expanded, setExpanded] = useState(false)
  const hidden = role.points.length - VISIBLE_POINTS
  const points = expanded ? role.points : role.points.slice(0, VISIBLE_POINTS)

  return (
    <article className="panel flex flex-col gap-7 p-7 sm:p-9">
      <header className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="font-display text-[1.375rem] font-semibold leading-tight text-ink">
            {role.company}
          </h3>
          {role.current ? <span className="chip">Current</span> : null}
        </div>

        <p className="text-[1.0625rem] leading-snug text-ink">{role.title}</p>

        <p className="label flex flex-wrap items-center gap-x-3 gap-y-2">
          <span>{role.period}</span>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-white/25" />
          <span>{role.location}</span>
        </p>
      </header>

      <ul className="flex flex-col gap-4 border-t border-white/10 pt-7">
        {points.map((point, i) => (
          <li
            key={point}
            className="flex gap-4"
            style={
              i >= VISIBLE_POINTS
                ? {
                    animation: `rise 500ms cubic-bezier(0.22,1,0.36,1) ${
                      (i - VISIBLE_POINTS) * 50
                    }ms both`,
                  }
                : undefined
            }
          >
            <span
              aria-hidden="true"
              className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: 'rgb(var(--accent) / 0.75)' }}
            />
            <span className="text-[0.9375rem] leading-[1.85] text-muted">{point}</span>
          </li>
        ))}
      </ul>

      {hidden > 0 ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className="label flex w-fit items-center gap-2.5 rounded-full border border-white/10 px-5 py-3 transition-colors duration-500 hover:border-[rgb(var(--accent)/0.5)]"
          style={{ color: 'rgb(var(--accent))' }}
        >
          {expanded ? 'Show less' : `Show ${hidden} more`}
          <span
            aria-hidden="true"
            className="transition-transform duration-500"
            style={{ transform: expanded ? 'rotate(180deg)' : 'none' }}
          >
            ↓
          </span>
        </button>
      ) : null}
    </article>
  )
}

export default function Experience() {
  const { data } = usePortfolio()

  return (
    <Band
      id="experience"
      label="Experience"
      title="Where the work happened"
      intro="Product design, design systems, and creative direction across multidisciplinary product teams."
    >
      <div className="flex flex-col gap-5">
        {data.experience.map((role, i) => (
          <Reveal key={`${role.company}-${role.period}`} delay={i * 90}>
            <RoleCard role={role} />
          </Reveal>
        ))}
      </div>
    </Band>
  )
}
