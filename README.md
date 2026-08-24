# Mohamad Hassan Aljeshi — Portfolio

Portfolio site for **Mohamad Hassan Aljeshi**, Art Director & UI/UX Designer, Damascus.

Live: <https://nazemms1.github.io/hassan-/>

## Stack

React 18 · TypeScript · Vite · Tailwind CSS. No UI or animation libraries — the
motion is CSS plus a small `IntersectionObserver` helper.

## Getting started

```bash
npm install
npm run dev
```

## GoatCounter Analytics

1. Create a GoatCounter site for `https://nazemms1.github.io/hassan-/`.
2. Create a local `.env.local` file with:

```env
VITE_GOATCOUNTER_ENDPOINT=https://yourcode.goatcounter.com/count
```

3. Build and deploy the site with `npm run deploy`.

The analytics script is loaded only when this variable exists. GoatCounter's
dashboard is available at `https://yourcode.goatcounter.com`.

| Script              | What it does                                    |
| ------------------- | ----------------------------------------------- |
| `npm run dev`       | Dev server on <http://localhost:5175>           |
| `npm run build`     | Production build into `dist/`                    |
| `npm run preview`   | Serves the built output locally                  |
| `npm run typecheck` | `tsc --noEmit`                                   |
| `npm run deploy`    | Builds, then publishes `dist/` to `gh-pages`     |

## Editing the content

**All copy, links, and data live in [`src/data/portfolio.ts`](src/data/portfolio.ts).**
No component needs to be touched to change text.

Two things still need real values before this is public:

1. **Portfolio and LinkedIn URLs** — currently `#` placeholders in
   `profile.socials`. Only the handle `Hassan-Aljeshi` was supplied, not full URLs.
2. **Case studies** — the four entries in `projects` are marked
   `placeholder: true` and render an "Image to come" frame. Replace the title,
   client, description and add an `image` path, then delete the `placeholder`
   flag to remove the warning line from the card.

To add a project image, drop the file in `public/` and reference it as
`image: '/hassan-/work/name.jpg'` (the base path matters on GitHub Pages).

## Design system

Defined once in [`src/index.css`](src/index.css) as CSS custom properties, and
exposed to Tailwind through `tailwind.config.js`.

- **Dark only.** There is no light theme; the palette is not inverted anywhere.
- **One accent:** `--accent` — a light professional blue (`#58A6FF`). It carries
  state (active nav item, current role, hover, focus) and nothing decorative.
- **Glass surfaces.** `.panel` is a translucent pane lit along its top edge,
  floating over blurred `.orb` elements that supply the colour behind it. Panel
  backgrounds come from white at low alpha, not from a solid token, so the
  ambient colour shows through.
- **Type:** Sora (display), Manrope (body), DM Mono (labels).

## Motion

All animation is suppressed by the `prefers-reduced-motion` block at the bottom
of `index.css`, and `useInView` reports visible immediately under that setting so
nothing stays hidden.

- `Reveal` — sections rise and unblur as they enter the viewport.
- `CountUp` — hero stats count up once, on first view.
- `.orb` — ambient colour drifts slowly behind the glass.
- `.panel-hover` — cards lift and a light sweeps across the glass.
- `.nav-link` — underline grows from the left; stays for the active section.
- `.pulse-dot` — availability indicator.
- Top bar carries a scroll-progress line; the mobile drawer staggers its items.

## Layout notes

- `TopBar` handles both the desktop nav and the full-screen mobile drawer
  (scroll lock, Escape to close, focus moved to the close button).
- `Band` wraps every section: ambient orbs, heading block, and consistent
  vertical rhythm.
- Sections are ordered by `sections` in `portfolio.ts`, which also drives the nav.
