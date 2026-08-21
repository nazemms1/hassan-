import { profile } from '../data/portfolio'
import Band from './Band'
import Reveal from './Reveal'


/** Digits only, as tel: and wa.me both require. */
const digits = (value: string) => value.replace(/\D/g, '')

const channels = [
  { label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
  { label: 'Phone', value: profile.phone, href: `tel:+${digits(profile.phone)}` },
  {
    label: 'WhatsApp',
    value: profile.whatsapp,
    href: `https://wa.me/${digits(profile.whatsapp)}`,
  },
  {
    label: 'LinkedIn',
    value: profile.socials.linkedin.label,
    href: profile.socials.linkedin.url,
  },
  {
    label: 'Portfolio',
    value: profile.socials.portfolio.label,
    href: profile.socials.portfolio.url,
  },
  { label: 'Based in', value: profile.location, href: undefined },
]

export default function Contact() {
  return (
    <Band
      id="contact"
      label="Contact"
      title="Let's make something"
      intro="Available for creative direction, product design, and identity work — in Damascus or remote."
      alt
    >
      <div className="flex flex-col gap-6">
        <Reveal className="panel relative overflow-hidden p-6 sm:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(70% 120% at 100% 0%, rgb(var(--accent) / 0.16), transparent 65%)',
            }}
          />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2">
              <span className="label">Start here</span>
              <a
                href={`mailto:${profile.email}`}
                className="break-words font-display text-[clamp(1.125rem,2.2vw,1.5rem)] font-semibold leading-tight text-ink transition-colors duration-500 hover:text-[rgb(var(--accent))]"
              >
                {profile.email}
              </a>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={`mailto:${profile.email}`} className="btn btn-primary">
                Send an email
              </a>
              <a
                href={`https://wa.me/${digits(profile.whatsapp)}`}
                target="_blank"
                rel="noreferrer noopener"
                className="btn btn-ghost"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal delay={90}>
          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {channels.map((channel) => (
              <div
                key={channel.label}
                className="panel panel-hover flex flex-col gap-2 px-5 py-4"
              >
                <dt className="label">{channel.label}</dt>
                <dd className="text-[0.9375rem] leading-snug text-ink">
                  {channel.href ? (
                    <a
                      href={channel.href}
                      className="break-words transition-colors duration-500 hover:text-[rgb(var(--accent))]"
                      {...(channel.href.startsWith('http')
                        ? { target: '_blank', rel: 'noreferrer noopener' }
                        : {})}
                    >
                      {channel.value}
                    </a>
                  ) : (
                    channel.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Band>
  )
}
