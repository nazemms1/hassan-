/** @type {import('tailwindcss').Config} */

// Colours live as RGB channels in CSS custom properties (see src/index.css) so
// they can be consumed with an alpha value from Tailwind utilities.
const token = (name) => ({ opacityValue }) =>
  opacityValue === undefined ? `rgb(var(${name}))` : `rgb(var(${name}) / ${opacityValue})`

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ground: token('--ground'),
        band: token('--band'),
        ink: token('--ink'),
        muted: token('--muted'),
        faint: token('--faint'),
        rule: token('--rule'),
        accent: token('--accent'),
      },
      fontFamily: {
        display: ['Sora', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        label: ['0.6875rem', { lineHeight: '1', letterSpacing: '0.14em' }],
        micro: ['0.8125rem', { lineHeight: '1.6' }],
      },
      maxWidth: {
        measure: '58ch',
        shell: '1280px',
      },
      borderRadius: {
        panel: '14px',
      },
      transitionTimingFunction: {
        seam: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
