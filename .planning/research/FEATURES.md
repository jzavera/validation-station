# Features Research: Document Validation Interfaces

## Table Stakes (must-have — users expect these from IDP validation UIs)

### Document Rendering
- PDF multi-page rendering with zoom — ALL platforms
- Image document rendering (scanned docs) — ALL platforms
- Document-to-field synchronization (click field → snap to region) — Rossum, UiPath, ABBYY
- Complexity: MEDIUM (react-pdf handles PDF, images are straightforward)

### Field Display & Navigation
- Fields organized by groups/sections — Rossum (sections), UiPath (taxonomy groups)
- Confidence indicators per field — ALL platforms (colors, dots, thresholds)
- Tab/keyboard navigation between fields — Rossum (Tab), UiPath (n/p keys)
- Active field highlighting in both panels — Rossum, UiPath
- Complexity: LOW-MEDIUM

### Bounding Box Overlays
- Token/word-level highlighting on document — ALL platforms
- Field-level bounding box fallback — ALL platforms
- Visual connection between field panel and document region — Rossum, UiPath, ABBYY
- Complexity: MEDIUM (normalized coordinates + CSS percentage positioning)

### Inline Editing
- Click-to-edit field values — ALL platforms
- Confirm/cancel edit with keyboard (Enter/Escape) — ALL platforms
- Value persistence during session — ALL platforms
- Complexity: LOW

### Validation Workflow
- Mark field as confirmed/validated — Rossum (green tick), UiPath (OperatorConfirmed)
- Confidence-based visual states (red/yellow/green) — ALL platforms
- Smart Tab: skip already-confirmed fields — Rossum
- Complexity: LOW

## Differentiators (competitive advantage)

### Advanced Editing
- Draw custom bounding box to re-extract — UiPath
- Select tokens directly on document to populate field — UiPath, Rossum
- Multi-word selection (Shift+click, Ctrl+click) — UiPath
- Alternative value suggestions — Rossum (Alt key), UiPath (f s)
- Complexity: HIGH

### Table/Grid Editing
- Line item table validation with grid navigation — Rossum (Magic Grid), UiPath
- Row add/delete, column mapping — Rossum, UiPath
- Arrow key navigation within grid cells — Rossum
- Complexity: HIGH

### Document Tools
- Page rotation — UiPath
- Text view toggle (OCR text vs image) — UiPath
- Document search within text — UiPath
- Split/merge documents — Rossum
- Complexity: MEDIUM-HIGH

### Workflow Integration
- Annotation status workflow (to_review → confirmed → exported) — Rossum
- Batch validation (queue of documents) — Rossum, ABBYY
- Draft saving (CTRL+SHIFT+S) — UiPath
- Business rules validation — ABBYY
- Complexity: HIGH

## Anti-Features (do NOT build in v1)

- **Real-time collaboration** — single operator workflow, adds massive complexity
- **Backend persistence** — frontend-only for v1, consumes JSON input
- **Document upload/processing** — this is post-extraction only
- **Custom ML model training** — out of scope entirely
- **Mobile/responsive layout** — desktop-only validation workflow
