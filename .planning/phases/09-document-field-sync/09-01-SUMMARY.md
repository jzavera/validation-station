# Summary 09-01: Document-Field Synchronization

## What was built

### New files
- **`src/hooks/useDocumentScroll.ts`** -- Hook that scrolls the document viewer to center the active field's bounding box region

### Modified files
- **`src/components/DocumentViewer.tsx`** -- Wires `useDocumentScroll` with the scroll container ref, active field, and zoom

## How it works

1. `DocumentViewer` already manages a `scrollRef` forwarded to the viewer component's outer scroll container
2. `useDocumentScroll(scrollRef, activeField, zoom)` runs an effect whenever `activeField` changes
3. The effect:
   - Finds the page element via `[data-page-number="${boundingBox.pageNumber}"]` selector within the scroll container
   - Calculates the field's Y position: `pageElement.offsetTop + (boundingBox.y * pageElement.clientHeight)`
   - Centers this position in the viewport: `scrollTo({ top: targetY - containerHeight/2, behavior: 'smooth' })`
4. For single-page images, there is only one page element (`data-page-number="1"`), so the scroll simply moves to the bbox Y position
5. For multi-page PDFs, each page has its own `data-page-number` attribute, so the hook automatically scrolls to the correct page

## Requirements satisfied
- SYNC-01: Active field change triggers document scroll to bounding box region
- SYNC-02: Works correctly across multi-page PDF documents (page selector)
- SYNC-03: Smooth scroll animation via `behavior: 'smooth'`

## Decisions
- (09-01) Hook runs in DocumentViewer (not inside viewers) since it needs both the scroll ref and the activeField
- (09-01) zoom is included as a dependency so scroll re-triggers if zoom changes while a field is active
- (09-01) scrollTo target is clamped to `Math.max(0, ...)` to prevent negative scroll positions
