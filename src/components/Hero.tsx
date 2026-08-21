import CountUp from './CountUp'
import { disciplines, profile, stats } from '../data/portfolio'

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

        {/* Identity panel — the name, and the numbers behind it, in one sheet. */}
        <div className="enter panel p-6 sm:p-8 [animation-delay:180ms]">
          <div className="flex items-center gap-4 border-b border-white/10 pb-6">
            <span
              aria-hidden="true"
              className="grid h-14 w-14 shrink-0 place-items-center rounded-panel font-display text-lg font-semibold"
              style={{ background: 'rgb(var(--accent) / 0.16)', color: 'rgb(var(--accent))' }}
            >
              MA
            </span>
            <span className="flex min-w-0 flex-col gap-1.5">
              <span className="font-display text-[1.125rem] font-semibold leading-tight text-ink">
                {profile.name}
              </span>
              <span className="label">{profile.role}</span>
            </span>
          </div>

          <dl className="grid grid-cols-2 pt-6">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1.5 py-4">
                <dt
                  className="font-display text-[1.75rem] font-semibold leading-none [font-variant-numeric:tabular-nums]"
                  style={{ color: 'rgb(var(--accent))' }}
                >
                  <CountUp value={stat.value} />
                </dt>
                <dd className="label leading-relaxed">{stat.label}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-2 flex flex-col gap-3 border-t border-white/10 pt-6">
            <a
              href={`mailto:${profile.email}`}
              className="flex items-center justify-between gap-4 text-[0.9375rem] text-ink transition-colors duration-500 hover:text-[rgb(var(--accent))]"
            >
              <span className="label">Email</span>
              <span className="truncate">{profile.email}</span>
            </a>
            <a
              href={`tel:+${profile.phone.replace(/\D/g, '')}`}
              className="flex items-center justify-between gap-4 text-[0.9375rem] text-ink transition-colors duration-500 hover:text-[rgb(var(--accent))]"
            >
              <span className="label">Phone</span>
              <span className="truncate">{profile.phone}</span>
            </a>
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
