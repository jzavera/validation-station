# Pitfalls Research: Document Validation Interfaces

## 1. react-pdf Page Dimensions Are Async

**What goes wrong:** The `<Page>` component from react-pdf provides rendered dimensions via `onRenderSuccess` callback, not synchronously. If you try to calculate scroll offsets or overlay positions before the page renders, coordinates are wrong.

**Warning signs:** Overlays appear at wrong positions on first render, then snap to correct position.

**Prevention:**
- Store each page's rendered dimensions in state via `onRenderSuccess`
- Only render BoundingBoxOverlay after dimensions are known
- Use percentage-based positioning (avoids needing pixel dimensions for overlay placement)

**Phase:** Phase where PdfViewer is built

## 2. PDF.js Worker Setup in Vite

**What goes wrong:** react-pdf requires a PDF.js web worker. Incorrect worker configuration causes "Setting up fake worker" warnings and broken rendering.

**Warning signs:** Console warnings about fake worker, PDFs not rendering.

**Prevention:**
```typescript
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();
```
Import this once at app entry point (main.tsx).

**Phase:** Phase 1 (scaffold)

## 3. Overlay Misalignment During Zoom

**What goes wrong:** When zoom changes, the page re-renders at a new size. If overlays use pixel-based positioning, they fall out of sync.

**Warning signs:** Bounding boxes drift from document text after zooming.

**Prevention:**
- Use `position: absolute; inset: 0` inside a `position: relative` wrapper matching page size
- All box coordinates as CSS percentages from normalized 0–1 values
- Wrapper naturally resizes with page — percentages scale automatically

**Phase:** Phase where overlays are built

## 4. Scroll-to-Field Accuracy Across Multi-Page PDFs

**What goes wrong:** With multi-page PDFs, cumulative page offsets depend on rendered heights and inter-page gaps. Simple offset calculations miss gaps.

**Warning signs:** Clicking a field on page 3 scrolls to wrong position.

**Prevention:**
- Maintain a `pageOffsets` array recalculated on zoom change or page render
- Each PageWrapper reports its offsetTop via ref
- useDocumentScroll uses these offsets + normalized Y coordinate for target

**Phase:** Phase where scroll-to-field is built

## 5. Tab Navigation Focus Management

**What goes wrong:** Browser's native Tab handling conflicts with custom Tab navigation. Field focus state gets confused between DOM focus and application state.

**Warning signs:** Tab jumps to browser chrome, double-Tab to advance, lost focus.

**Prevention:**
- `e.preventDefault()` on Tab keydown in the navigation hook
- Use application-level active field state, not DOM focus
- Only auto-focus the input element when entering edit mode
- Distinguish between "active" (highlighted) and "focused" (has DOM focus)

**Phase:** Phase where keyboard navigation is built

## 6. Edit State Conflicts with Keyboard Shortcuts

**What goes wrong:** Keyboard shortcuts (Tab, Space, +/-) fire while user is typing in an edit field.

**Warning signs:** Pressing space while editing a value confirms the field instead of typing a space.

**Prevention:**
- Check `isEditing` state in keyboard handler — skip all shortcuts when editing
- Only the EditableValue component handles keyboard events during edit mode
- Tab during editing: confirm edit first, then advance (UiPath pattern)

**Phase:** Phase where EditableValue is built

## 7. Performance with Many Bounding Boxes

**What goes wrong:** Rendering hundreds of absolute-positioned divs for all field overlays on all pages causes sluggish rendering.

**Warning signs:** Slow scrolling, laggy zoom, high DOM node count.

**Prevention:**
- Only render overlays for the active field (not all fields)
- Only render overlays on the page containing the active field's bounding box
- Lazy-render pages outside viewport (react-pdf supports this)

**Phase:** All overlay phases

## 8. Image vs PDF Coordinate Mismatch

**What goes wrong:** PDF coordinates are in points (72 DPI), image coordinates are in pixels. If the overlay math assumes one format, the other breaks.

**Warning signs:** Overlays work for PDF but not images, or vice versa.

**Prevention:**
- Normalize ALL coordinates to 0–1 in the data model (already decided)
- The rendering layer (percentage CSS) doesn't care about native units
- PageDimension stores native units only for aspect ratio calculation

**Phase:** Phase where ImageViewer is built
