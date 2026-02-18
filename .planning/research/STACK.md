# Stack Research: Validation Station

## Recommended Stack (2026)

### Core Framework
- **React 19** + **TypeScript 5.x** — industry standard for complex interactive UIs
- **Vite 6.x** — fastest DX, native ESM, excellent HMR
- Rationale: All major IDP platforms (Rossum, UiPath) use React-based frontends for their validation interfaces

### PDF Rendering
- **react-pdf 9.x** (wraps pdfjs-dist 4.x) — most mature React wrapper for PDF.js
- Handles multi-page rendering, text layers, annotation layers
- Worker setup: `new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url)` for Vite
- Confidence: HIGH — used in production by many document processing apps

### Styling
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin — zero-config, utility-first
- **clsx** — conditional class name composition
- Rationale: Fastest iteration for building complex UI layouts

### State Management
- **React Context + useReducer** — sufficient for single-document, single-operator scope
- No Redux/Zustand needed — state shape is simple (active field, editing state, zoom)
- Rationale: Avoids dependency bloat for a focused validation workflow

### What NOT to Use
- **Redux/MobX** — overkill for this scope, adds complexity without benefit
- **Canvas-based rendering** for the document — CSS overlays with percentage-based positioning are simpler and zoom-independent
- **iframe-based PDF embedding** — no programmatic control over page rendering or overlay positioning
- **Custom PDF parser** — pdfjs-dist handles all PDF complexities

## Versions (verified current as of 2026-02)
| Package | Version | Confidence |
|---------|---------|------------|
| react | 19.x | HIGH |
| react-pdf | 9.x | HIGH |
| pdfjs-dist | 4.x (bundled) | HIGH |
| tailwindcss | 4.x | HIGH |
| @tailwindcss/vite | 4.x | HIGH |
| vite | 6.x | HIGH |
| typescript | 5.x | HIGH |
| clsx | 2.x | HIGH |
