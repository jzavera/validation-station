# Research Summary: Validation Station

## Stack
React 19 + TypeScript + Vite 6 + Tailwind CSS v4 + react-pdf 9.x. State via React Context + useReducer. No external state library needed.

## Table Stakes Features
- Two-panel layout (document left, fields right)
- PDF + image document rendering with zoom
- Field groups with confidence indicators (red/yellow/green)
- Tab/keyboard navigation between fields
- Click-to-edit field values
- Bounding box overlays on document for active field
- Click field → document snaps to extraction region
- Field confirmation workflow (operatorConfirmed)
- Smart Tab: skip already-confirmed fields

## Architecture
- ValidationProvider (context) as single state source
- DocumentViewer dispatches to PdfViewer or ImageViewer
- BoundingBoxOverlay uses percentage-based CSS from normalized 0–1 coords
- FieldPanel drives all user interactions; DocumentViewer is read-only
- Build order: types → state → layout → field panel → viewers → overlays → navigation → polish

## Watch Out For
1. react-pdf page dimensions are async (use onRenderSuccess)
2. PDF.js worker setup requires specific Vite import pattern
3. Overlay alignment during zoom (use percentage positioning, not pixels)
4. Multi-page scroll offset calculation (maintain pageOffsets array)
5. Tab navigation conflicts with browser defaults (preventDefault)
6. Edit state must suppress keyboard shortcuts (check isEditing)
7. Only render overlays for active field (performance)
8. Normalized 0–1 coordinates avoid PDF/image coordinate mismatch
