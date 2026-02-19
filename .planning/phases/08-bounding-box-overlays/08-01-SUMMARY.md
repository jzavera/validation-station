# Summary 08-01: Bounding Box Overlays

## What was built

### New files
- **`src/components/BoundingBoxOverlay.tsx`** -- Renders colored highlight overlays for the active field's extraction region on the document

### Modified files
- **`src/components/DocumentViewer.tsx`** -- Derives `activeField` from state using `useMemo` and passes it to viewers
- **`src/components/PdfViewer.tsx`** -- Accepts `activeField` prop, renders `<BoundingBoxOverlay>` inside each page wrapper
- **`src/components/ImageViewer.tsx`** -- Accepts `activeField` prop, renders `<BoundingBoxOverlay>` inside the image wrapper

## How it works

1. `DocumentViewer` looks up the active field by scanning all field groups for a field whose `id` matches `state.activeFieldId`
2. The `activeField` object is passed down to `PdfViewer`/`ImageViewer` as a prop
3. Each viewer renders `<BoundingBoxOverlay activeField={activeField} pageNumber={N} />` inside the `position: relative` page wrapper
4. `BoundingBoxOverlay` checks whether the field has tokens:
   - If `tokens.length > 0`, it uses the token-level bounding boxes
   - Otherwise, it falls back to the field-level `boundingBox`
5. Boxes are filtered by `pageNumber` and rendered as absolutely positioned divs using percentage-based CSS (`left/top/width/height` derived from normalized 0-1 coordinates)
6. Overlays use blue border + semi-transparent blue fill (`border-blue-500 bg-blue-500/20`) and `pointer-events-none` to avoid interfering with interactions

## Requirements satisfied
- BBOX-01: Token-level bounding boxes rendered as overlays
- BBOX-02: Field-level boundingBox used as fallback when no tokens
- BBOX-03: Normalized 0-1 coordinates with percentage-based CSS positioning
- BBOX-04: Overlays stay aligned during zoom (percentages relative to parent)
- BBOX-05: Only active field's overlays rendered

## Decisions
- (08-01) BoundingBoxOverlay is a pure presentational component -- no context dependency, receives everything via props
- (08-01) activeField derivation uses useMemo in DocumentViewer for efficient re-computation
- (08-01) Overlay container uses `absolute inset-0` to cover the full page area
