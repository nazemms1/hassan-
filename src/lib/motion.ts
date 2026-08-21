import { useEffect, useRef, useState, type RefObject } from 'react'

/** Whether the viewer has asked the OS to keep motion to a minimum. */
export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

type InViewOptions = {
  /** Fraction of the element that must be visible before it counts. */
  threshold?: number
  /** Shrinks the viewport so things trigger slightly before the very edge. */
  rootMargin?: string
}

/**
 * Fires once, the first time an element scrolls into view. Returns `true`
 * immediately under reduced motion, so nothing depending on it stays hidden.
 */
export function useInView<T extends HTMLElement>({
  threshold = 0.05,
  rootMargin = '0px 0px -10% 0px',
}: InViewOptions = {}): [RefObject<T>, boolean] {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (prefersReducedMotion()) {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold, rootMargin },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return [ref, inView]
}
