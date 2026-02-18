# Summary 07-01: Document Rendering

## What was built

Three new components that render documents in the left panel:

1. **PdfViewer.tsx** -- Uses react-pdf `Document` and `Page` to render all PDF pages in a scrollable container. Each page wrapped in `position: relative` div for future overlay support. Zoom applied via `scale` prop. Forwards ref to scroll container for Phase 9.

2. **ImageViewer.tsx** -- Renders a single `<img>` in a scrollable container with CSS `transform: scale(zoom)` and `transform-origin: top left`. Error fallback shows "Document not available" message. Forwards ref to scroll container.

3. **DocumentViewer.tsx** -- Reads `state.result.document.type` from context and dispatches to `PdfViewer` (type "pdf") or `ImageViewer` (type "image"). Passes zoom from state.

4. **App.tsx** -- Left panel placeholder replaced with `<DocumentViewer />`.

## Requirements addressed

| Req | Status | Notes |
|-----|--------|-------|
| DOC-01 | Done | PdfViewer renders multi-page PDFs via react-pdf |
| DOC-02 | Done | ImageViewer renders PNG/JPG with same container structure |
| DOC-03 | Done | DocumentViewer dispatches based on document.type |
| DOC-04 | Done | Header buttons (Phase 2) + keyboard shortcuts (Phase 5) already wired |
| DOC-05 | Done | Zoom stored in reducer state, not local to viewer |

## Decisions

- PdfViewer uses `renderTextLayer={true}` and `renderAnnotationLayer={true}` for full fidelity
- ImageViewer uses CSS transform for zoom (not width/height) to maintain crisp rendering
- Both viewers wrap content in `position: relative` divs with `data-page-number` attributes for Phase 8 overlay targeting
- Error states show a centered icon + message rather than crashing
- Outer panel div uses `overflow-hidden` while inner viewers manage their own scrolling

## Verification

- `npx tsc --noEmit` passes
- `npm run build` succeeds (82 modules, 1.62s)
- Sample data uses type "image", so ImageViewer is the active renderer
- ImageViewer shows error fallback since `/sample-invoice.png` doesn't exist (expected)
