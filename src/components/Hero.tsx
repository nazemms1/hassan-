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

        <div
          aria-label="A preview of a design workspace"
          className="enter design-workspace panel [animation-delay:180ms]"
        >
          <div className="design-toolbar">
            <div className="flex items-center gap-2.5">
              <span className="design-window-dots" aria-hidden="true"><i /><i /><i /></span>
              <span className="design-mark">M</span>
              <span className="design-file">Untitled / Portfolio</span>
            </div>
            <div className="design-toolbar-actions" aria-hidden="true">
              <span className="design-tool design-tool-active">▣</span>
              <span className="design-tool">⌁</span>
              <span className="design-tool">▱</span>
              <span className="design-zoom">100% <b>⌄</b></span>
              <span className="design-tool">⊞</span>
              <span className="design-avatar">MH</span>
            </div>
          </div>

          <div className="design-body">
            <aside className="design-sidebar" aria-label="Layers">
              <span className="design-sidebar-title">Layers</span>
              <span className="design-layer design-layer-active"><b>◇</b> Portfolio</span>
              <span className="design-layer"><b>▱</b> Header</span>
              <span className="design-layer"><b>▱</b> Selected work</span>
              <span className="design-layer"><b>▱</b> Contact</span>
            </aside>

            <div className="design-canvas">
              <span className="design-stage-label">Frame / Desktop — 1440 × 900</span>
              <div className="design-artboard">
                <div className="design-artboard-top">
                  <span className="design-kicker">CASE STUDY / 01</span>
                  <span className="design-menu" aria-hidden="true">↗</span>
                </div>
                <div className="design-artboard-content">
                  <span className="design-accent-line" aria-hidden="true" />
                  <span className="design-small-type">PRODUCT DESIGN / MOBILE</span>
                  <strong>Pulsey<span className="design-period">.</span></strong>
                  <span className="design-artboard-note">Turning health data<br />into meaningful insights.</span>
                  <div className="design-project-image-wrap">
                    <img
                      src="/hassan-/images/Pulsey.webp"
                      alt="Pulsey health tracking product interface"
                      className="design-project-image"
                    />
                    <span className="design-selection-tag">Image / 01</span>
                    <i className="design-handle design-handle-tl" />
                    <i className="design-handle design-handle-tr" />
                    <i className="design-handle design-handle-bl" />
                    <i className="design-handle design-handle-br" />
                  </div>
                  <div className="design-project-meta">
                    <span>UI / UX</span>
                    <span>2025</span>
                  </div>
                </div>
                <div className="design-artboard-footer">
                  <span>MH / CREATIVE DIRECTION</span>
                  <span>01—04</span>
                </div>
              </div>
            </div>

            <aside className="design-properties" aria-label="Design properties">
              <span className="design-sidebar-title">Design</span>
              <div className="design-properties-tabs"><b>Design</b><span>Prototype</span></div>
              <span className="design-property-label">Frame</span>
              <div className="design-input-row"><span>W</span><b>420</b><span>H</span><b>560</b></div>
              <div className="design-input-row"><span>X</span><b>510</b><span>Y</span><b>168</b></div>
              <span className="design-property-label">Fill</span>
              <div className="design-fill-row"><span className="design-swatch" /> <b>#12141C</b></div>
              <span className="design-property-label">Corner radius</span>
              <div className="design-radius-row"><b>12</b><span>px</span></div>
              <span className="design-property-label">Type</span>
              <div className="design-type-row"><b>Sora</b><span>Semibold</span></div>
            </aside>
          </div>

          <div className="design-statusbar">
            <span><i /> All changes saved</span>
            <span>Prototype ready <b>↗</b></span>
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
