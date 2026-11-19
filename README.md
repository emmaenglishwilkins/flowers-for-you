# Camille Vance — Experiential Producer Portfolio

A one-page, 360-degree boundless spatial portfolio crafted with tactile black-work floral art, charcoal ink textures, and a live theatrical follow-spot scroll visualizer.

## Features

- **Seamless 360° Toroidal Canvas**: Pan and scroll endlessly in every direction (horizontal, vertical, diagonal) with smooth `requestAnimationFrame` inertia/momentum physics and zero seams or dead ends.
- **Multi-Modal Navigation**: Supports 2D trackpad scroll, mouse wheel, click-and-drag panning, touch drag, arrow keys, a live 360° bearing compass, and an interactive Toroidal Index & Mini-Map drawer.
- **Theatrical Spotlight Scroll Visualizer**: A dynamic follow-spot beam responds organically to scroll velocity, heading direction, and cursor position—revealing crisp charcoal-on-rag-paper black-work details inside the beam while the surrounding field softly recedes into moody silhouetted stage linework. Includes a quick **Work Light** toggle (`L` key or HUD button) for full-canvas inspection.
- **Bespoke Black-Work Artwork**: Hand-plotted organic SVG/Canvas floral markers, dry-brush ink filters, paper grain, and 8 art-directed monochrome production plates with zero external image dependencies.
- **Single-File Content Editing**: Swap in your real bio, contact details, and case studies in one cleanly typed file (`src/data/portfolio.ts`).

## Local Development

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (default `http://localhost:5173`).

## Typecheck & Production Build

```bash
npx tsc --noEmit
npm run build
```

Static production assets are emitted to `dist/`. Preview the production build locally with:

```bash
npm run preview
```

## Customizing Your Portfolio

Open `src/data/portfolio.ts` to update:

- `PRODUCER_PROFILE` — Name, monogram, title, location, availability, bio, disciplines, selected clients, press/awards, and contact links.
- `PROJECTS` — The 8 experiential production case studies (title, client, venue, year, role, scale, narrative, highlights, systems, credits, floral marker style, and `(x, y)` coordinates on the 360° field).
- `FIELD_ANNOTATIONS` & `DECORATIVE_BLOOMS` — Hand-scrawled zine notes and botanical landmarks placed across the infinite canvas.

## Static Hosting (Zero-Config)

Because `npm run build` outputs pure static HTML/CSS/JS to `dist/` (with `base: './'` configured in `vite.config.ts`), you can deploy anywhere:

- **Netlify**: Drag and drop `dist/`, or connect the repo with Build Command `npm run build` and Publish Directory `dist`.
- **Vercel**: Import the repo with Framework Preset `Vite` (Build Command `npm run build`, Output Directory `dist`).
- **Cloudflare Pages**: Connect the repo with Build Command `npm run build` and Build Output Directory `dist`.
- **GitHub Pages**: Publish the `dist/` directory to `gh-pages` or via GitHub Actions.
