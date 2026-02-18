# Validation Station

## What This Is

A standalone web application for human validation of document extraction results. After an ML pipeline extracts structured data (fields, values, bounding boxes) from documents (PDFs and images), an operator uses this interface to review each field, verify or correct extracted values, and confirm the extraction quality — all while seeing the source document with highlighted regions corresponding to each field.

## Core Value

The operator can efficiently review and validate every extracted field by navigating with Tab, seeing confidence at a glance, editing incorrect values inline, and visually confirming each extraction against the highlighted source document region.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Two-panel split layout: document viewer (left) + field panel (right)
- [ ] Render PDF documents with page navigation and zoom
- [ ] Render image documents (PNG/JPG) with zoom
- [ ] Display field groups with fields showing extracted values and confidence indicators
- [ ] Tab navigation between fields (smart-skip already-confirmed fields)
- [ ] Click-to-edit fields with Enter to confirm, Escape to cancel
- [ ] Click a field → document snaps to the field's bounding box region
- [ ] Highlight token-level bounding boxes on the document for the active field
- [ ] Confidence indicators: red (<0.7), yellow (0.7–0.9), green (≥0.9), checkmark (human confirmed)
- [ ] Space to confirm a field as validated (operatorConfirmed)
- [ ] Track edit history via dataVersion counter
- [ ] Mark fields as missing (isMissing flag)
- [ ] Status bar showing field position and keyboard hints
- [ ] Zoom controls (buttons + keyboard shortcuts)

### Out of Scope

- Multi-user collaboration / real-time sync — single operator workflow
- Backend API / database persistence — frontend-only, consumes JSON input
- Table/line-item extraction with grid editing — field-level validation only for v1
- OCR / ML extraction — this app is post-extraction validation only
- Authentication / user management — standalone tool
- Document upload — receives pre-processed extraction results JSON

## Context

**Domain research completed.** The design is informed by analysis of 6 major IDP platforms:
- **Rossum** — validation_sources tracking, smart Tab skip of confirmed fields, section→datapoint hierarchy, annotation workflow states
- **UiPath** — operatorConfirmed flag, separate OCR vs extraction confidence, dataVersion counter, isMissing flag, ResultsContentReference with token-level boxes
- **ABBYY Vantage** — character-level confidence thresholds, auto-skip reliably recognized fields
- **Google Document AI** — normalized 0–1 bounding box coordinates, textAnchor for exact character positions
- **Amazon Textract** — dual geometry (BoundingBox + Polygon), block hierarchy
- **Azure Document Intelligence** — separate word-level and field-level confidence, threshold-based routing

**Universal patterns adopted:**
1. Normalized 0–1 coordinates (Google, Textract, Azure)
2. operatorConfirmed flag (UiPath, Rossum)
3. validationSource tracking (Rossum)
4. Smart Tab skip confirmed fields (Rossum)
5. Separate OCR vs extraction confidence (UiPath)
6. dataVersion counter (UiPath)
7. isMissing flag (UiPath)
8. Token-level bounding boxes (all platforms)
9. Two-panel split layout (Rossum, UiPath, ABBYY)

**JSON data model designed** with ExtractionResult → DocumentMeta + FieldGroup[] → Field[] → BoundingBox + TokenBox[].

## Constraints

- **Tech stack**: React 19 + TypeScript, Vite, Tailwind CSS v4, react-pdf, clsx — no external state libraries
- **Document types**: Must support both PDF (via react-pdf/pdfjs-dist) and scanned images (PNG/JPG)
- **Coordinates**: All bounding boxes normalized 0–1 relative to page dimensions
- **State management**: React Context + useReducer (no Redux, Zustand, etc.)
- **Standalone**: Runs as its own app with `npm run dev`, no backend dependency

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Normalized 0–1 bounding box coordinates | Zoom-independent overlay math — percentage-based CSS positioning scales automatically | — Pending |
| React Context + useReducer over external state lib | Scope is manageable (tens of fields, single document), avoids dependency bloat | — Pending |
| react-pdf for PDF rendering | Most mature React wrapper for pdfjs-dist, good community support | — Pending |
| Smart Tab skip (Rossum pattern) | Major efficiency gain — operators only stop on fields that need attention | — Pending |
| Tailwind CSS v4 with @tailwindcss/vite plugin | Zero-config CSS utility framework, clean DX with Vite | — Pending |
| Token-level highlighting over field-level only | All major IDP platforms do this — operators need word-level precision | — Pending |

---
*Last updated: 2026-02-18 after initialization*
