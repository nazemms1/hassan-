import { disciplines, profile } from '../data/portfolio'

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden border-b border-rule"
    >
      {/* Ambient light for the glass to pick up — one hue, two intensities. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span
          className="orb h-[560px] w-[560px] opacity-[0.34]"
          style={{ background: 'rgb(var(--accent))', top: '-220px', left: '-160px' }}
        />
        <span
          className="orb h-[440px] w-[440px] opacity-[0.16]"
          style={{
            background: 'rgb(var(--accent))',
            bottom: '-180px',
            right: '-120px',
            animationDelay: '-9s',
            animationDuration: '28s',
          }}
        />
      </div>

      <div className="relative mx-auto grid w-full max-w-shell gap-14 px-6 pb-20 pt-32 sm:px-10 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-20 lg:pb-24 lg:pt-36">
        <div className="flex flex-col items-start gap-7">
          <span className="enter chip flex items-center gap-2">
            <span
              aria-hidden="true"
              className="pulse-dot mr-2 h-1.5 w-1.5 rounded-full"
              style={{ background: 'rgb(var(--accent))' }}
            />
            Available for work
          </span>

          <h1 className="enter font-display text-[clamp(1.875rem,4vw,3rem)] font-semibold leading-[1.15] text-ink [animation-delay:100ms]">
            {profile.role}
            <span className="mt-2 block text-muted">based in {profile.location}</span>
          </h1>

          <p className="enter prose-measure text-[1rem] [animation-delay:200ms]">
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
          <div className="hero-portrait" aria-label="Portrait of Hassan">
            <img src="/hassan-/Photo.png" alt="Portrait of Hassan" />
            <span className="hero-portrait-label">Creative director / 2025</span>
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
