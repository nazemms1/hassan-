import type { ReactNode } from 'react'
import { useInView } from '../lib/motion'

type Props = {
  children: ReactNode
  /** Stagger, in ms, applied once the element enters the viewport. */
  delay?: number
  className?: string
}

/**
 * Scroll reveal — a long, soft rise so sections arrive rather than snap.
 * Under reduced motion `useInView` reports true immediately and the global
 * media query flattens the transition, so content simply appears.
 */
export default function Reveal({ children, delay = 0, className = '' }: Props) {
  const [ref, shown] = useInView<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={`transition-[opacity,transform,filter] duration-[1100ms] ease-seam ${
        shown ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-8 opacity-0 blur-[3px]'
      } ${className}`}
      style={{ transitionDelay: shown ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  )
}
