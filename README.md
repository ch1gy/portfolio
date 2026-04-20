# chigy.dev — Portfolio

Personal portfolio site for Chiraag Barot. Built with React + Vite, deployed on Vercel.

## Stack

- **React 19** — UI
- **Vite 7** — build tool
- **Vanilla CSS-in-JS** — all styles live in component files, no UI library
- **Google Fonts** — Playfair Display, Bebas Neue, DM Mono

## Getting started

```bash
npm install
npm run dev
```

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server at `localhost:5173` |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## Project structure

```
src/
├── App.jsx       # All sections, data, styles, and easter egg logic
├── layout.jsx    # Nav, footer, mobile menu
└── main.jsx      # React entry point
```

All page content (projects, skills, contact links) is defined in the `DATA` object at the top of `App.jsx`.

## Easter egg

There's a pixel duck that peeks from the screen edges. Click it to unlock duck cursor mode. 🦆

## Deployment

Deployed automatically via Vercel on every push to `main`. Security headers (CSP, HSTS, etc.) are configured in `vercel.json`.
