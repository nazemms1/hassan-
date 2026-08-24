import { disciplines, profile, stats } from '../data/portfolio'

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden"
    >
      <div className="relative mx-auto grid w-full max-w-shell gap-10 px-6 pb-14 pt-24 sm:px-10 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-14 lg:pb-16 lg:pt-24">
        <div className="hero-copy flex flex-col items-start gap-5">
          <span className="enter chip flex items-center gap-2">
            <span
              aria-hidden="true"
              className="pulse-dot mr-2 h-1.5 w-1.5 rounded-full"
              style={{ background: 'rgb(var(--accent))' }}
            />
            Available for work
          </span>

          <span className="enter hero-name label [animation-delay:60ms]">{profile.name}</span>

          <h1 className="enter hero-title font-display font-semibold leading-[1.08] text-ink [animation-delay:100ms]">
            {profile.role}
            <span className="hero-title-location mt-2 block text-muted">based in {profile.location}</span>
          </h1>

          <p className="enter prose-measure text-[0.875rem] [animation-delay:200ms]">
            {profile.tagline}. {profile.longBio}
          </p>

          <div className="enter flex flex-wrap items-center gap-3 [animation-delay:280ms]">
            <a href={`mailto:${profile.email}`} className="btn btn-primary">
              Start a project
            </a>
            <a href="#work" className="btn btn-ghost">
              See the work
            </a>
          </div>

          <ul className="enter flex flex-wrap gap-2 [animation-delay:360ms]">
            {disciplines.map((discipline) => (
              <li
                key={discipline.name}
                className="label rounded-full border border-white/10 px-3.5 py-2 text-muted"
              >
                {discipline.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="enter hero-visual [animation-delay:180ms]">
          <div className="hero-portrait-stage">
            <span className="hero-ring hero-ring-one" aria-hidden="true" />
            <span className="hero-ring hero-ring-two" aria-hidden="true" />
            <span className="hero-ring hero-ring-three" aria-hidden="true" />
            <div className="hero-portrait" aria-label="Portrait of Hassan">
              <img src="/hassan-/Photo.png" alt="Portrait of Hassan" />
            </div>
          </div>
          <div className="hero-signature label">Mohamad — UI/UX &amp; art direction</div>
          <div className="hero-stats panel">
            {stats.map((stat) => (
              <div key={stat.label} className="hero-stat">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <a
        href="#work"
        className="label absolute inset-x-0 bottom-8 mx-auto hidden w-fit items-center gap-2 text-muted transition-colors duration-500 hover:text-ink lg:flex"
      >
        Scroll
        <span aria-hidden="true">↓</span>
      </a>
    </section>
  )
}
