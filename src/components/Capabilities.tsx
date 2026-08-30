import { useState } from 'react'
import { usePortfolio } from '../context/PortfolioContext'
import Band from './Band'
import Reveal from './Reveal'

export default function Capabilities() {
  const { data } = usePortfolio()
  const skills = data.skills

  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const currentCategory = activeCategory || skills[0]?.category || 'Design'
  const group = skills.find((entry) => entry.category === currentCategory) ?? skills[0]

  if (!skills || skills.length === 0) return null

  return (
    <Band
      id="capabilities"
      label="Capabilities"
      title="What I bring"
      intro="The practice, the software, and the way I work with the people around it."
      alt
    >
      <div className="flex flex-col gap-8">
        <Reveal>
          <div
            role="tablist"
            aria-label="Capability groups"
            className="no-scrollbar flex gap-2 overflow-x-auto"
          >
            {skills.map((entry) => {
              const isActive = entry.category === currentCategory
              return (
                <button
                  key={entry.category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(entry.category)}
                  className={`label whitespace-nowrap rounded-full border px-5 py-3 transition-[color,background-color,border-color] duration-500 ${
                    isActive ? 'text-ink' : 'border-rule text-muted hover:text-ink'
                  }`}
                  style={
                    isActive
                      ? {
                          borderColor: 'rgb(var(--accent) / 0.5)',
                          background: 'rgb(var(--accent) / 0.14)',
                        }
                      : undefined
                  }
                >
                  {entry.category}
                  <span className="ml-2 text-faint">{entry.items.length}</span>
                </button>
              )
            })}
          </div>
        </Reveal>

        {group && (
          <Reveal delay={80}>
            <ul
              key={group.category}
              className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
            >
              {group.items.map((item, i) => (
                <li
                  key={item}
                  className="panel panel-hover flex items-center gap-4 px-5 py-4"
                  style={{ animation: `rise 600ms cubic-bezier(0.22,1,0.36,1) ${i * 40}ms both` }}
                >
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: 'rgb(var(--accent))' }}
                  />
                  <span className="text-[0.9375rem] font-medium leading-snug text-ink">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>
    </Band>
  )
}
