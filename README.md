# Studio Noréll — Luxury Furniture Atelier

An Awwwards-grade hero experience for a fictional collectible-furniture brand,
**Studio Noréll** — _"Quietly monumental."_ Editorial, architectural and warm,
built as a production-ready Next.js 15 application.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/hrishizone/studio-norell)

---

## ✦ Highlights

- **Smooth loading screen** with a counting curtain reveal
- **Bespoke cursor** with contextual labels + magnetic buttons
- **WebGL hero sculpture** — a shader-displaced "liquid stone" (React Three Fiber)
- **Lenis smooth scroll** wired into **GSAP ScrollTrigger**
- **Masked image reveals**, parallax, split-text word reveals
- **Pinned horizontal-scroll** collections gallery
- **Scroll-driven manifesto** (word-by-word illumination)
- **Glass-morphism**, animated blueprint grid, film-grain noise
- Transparent → blurred-glass nav with **active section indicator** + animated underline
- **Fullscreen mobile menu** with clip-path curtain
- Full **SEO** (metadata, OpenGraph, JSON-LD, sitemap, robots)
- **Accessibility**: semantic HTML, keyboard nav, ARIA, reduced-motion support

## ✦ Tech Stack

Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS ·
GSAP + ScrollTrigger · Lenis · Framer Motion · React Three Fiber / three.js ·
React Icons · ESLint.

## ✦ Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run start   # serve production build
npm run lint    # eslint
npm run typecheck
```

## ✦ Architecture

```
src/
├── animations/     # GSAP registration + config
├── app/            # App Router: layout, page, robots, sitemap, globals
├── cms/            # Editorial content (single source of truth)
├── components/
│   ├── layout/     # Loader, Navbar, MobileMenu, Footer
│   ├── shared/     # Cursor, MagneticButton, ImageReveal, RevealText, Marquee…
│   └── three/      # R3F canvas, sculpture mesh, GLSL shaders
├── hooks/          # useMagnetic, useTextReveal, useActiveSection, media queries…
├── providers/      # Smooth scroll, cursor, loader contexts
├── sections/       # Hero, Collections, Manifesto, Atelier
├── types/          # Shared TypeScript contracts
└── utils/          # cn, constants, splitText
```

## ✦ Deploying to Vercel

1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new) — the framework is
   auto-detected (Next.js). No environment variables are required.
3. Deploy. That's it.

Imagery is loaded from Unsplash via `next/image` (allowed hosts are configured
in `next.config.mjs`).

## ✦ Credits

- Hero is an interactive **living-room vignette**. Furniture models —
  **SheenChair**, **GlamVelvetSofa**, **IridescentDishWithOlives** — are from the
  [Khronos glTF Sample Assets](https://github.com/KhronosGroup/glTF-Sample-Assets)
  (CC0 / public domain), vendored under `public/models/`. The room shell, coffee
  table, floor lamp, plant, art and dust are procedural.
- Drag to orbit the room; tap a piece to open its spec card. The camera idles
  with a gentle sway and the lamp quietly breathes.
- Studio lighting uses three.js `RoomEnvironment` (no HDRI asset shipped).
- Imagery from Unsplash via `next/image`.

---

_All brand identity and copy here are fictional and for demonstration._
