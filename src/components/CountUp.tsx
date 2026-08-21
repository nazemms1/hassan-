import { useEffect, useState } from 'react'
import { prefersReducedMotion, useInView } from '../lib/motion'

type Props = {
  /** The finished string, e.g. "3+", "100h", "12". */
  value: string
  className?: string
}

/** Splits "100h" into 100 and "h" so only the number animates. */
function parse(value: string) {
  const match = value.match(/^(\d+)(.*)$/)
  return match ? { target: Number(match[1]), suffix: match[2] } : null
}

const DURATION = 1100

/**
 * Counts a stat up to its value the first time it scrolls into view. Falls
 * back to the plain string when the value isn't numeric, or when the viewer
 * has asked for reduced motion.
 */
export default function CountUp({ value, className = '' }: Props) {
  const parsed = parse(value)
  const [ref, inView] = useInView<HTMLSpanElement>({ threshold: 0.4 })
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!parsed || !inView || prefersReducedMotion()) return

    let frame = 0
    const start = performance.now()

    const step = (now: number) => {
      const progress = Math.min((now - start) / DURATION, 1)
      // Ease-out, so it decelerates into the final number.
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.round(parsed.target * eased))
      if (progress < 1) frame = requestAnimationFrame(step)
    }

    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [inView, parsed])

  if (!parsed) {
    return <span className={className}>{value}</span>
  }

  return (
    <span ref={ref} className={className}>
      {prefersReducedMotion() ? parsed.target : current}
      {parsed.suffix}
    </span>
  )
}
