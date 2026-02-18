# Requirements: Validation Station

**Defined:** 2026-02-18
**Core Value:** Operator can efficiently review and validate every extracted field by navigating with Tab, editing values inline, and visually confirming each extraction against the highlighted source document region.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Layout & Shell

- [ ] **LAYOUT-01**: App renders a full-screen two-panel split view with document viewer (left, 55%) and field panel (right, 45%)
- [ ] **LAYOUT-02**: Header bar displays app title, zoom controls (+/-/reset), and a "Confirm All" button
- [ ] **LAYOUT-03**: Status bar shows current field position (e.g., "Field 3/12") and keyboard shortcut hints

### Document Rendering

- [ ] **DOC-01**: App renders multi-page PDF documents using react-pdf with all pages visible in a scrollable container
- [ ] **DOC-02**: App renders image documents (PNG/JPG) in the document viewer with the same overlay support
- [ ] **DOC-03**: Document viewer dispatches to correct renderer (PDF or image) based on `document.type` in the extraction result
- [ ] **DOC-04**: User can zoom in/out of the document using header buttons and keyboard shortcuts (+/-)
- [ ] **DOC-05**: Zoom level persists across field navigation (doesn't reset when changing active field)

### Field Display

- [ ] **FIELD-01**: Fields are displayed organized by field groups, each group with a visible label/header
- [ ] **FIELD-02**: Each field row shows: confidence indicator, field label, and extracted value
- [ ] **FIELD-03**: Confidence indicator shows red dot for <0.7, yellow dot for 0.7-0.9, green dot for >=0.9
- [ ] **FIELD-04**: Confirmed fields show a green checkmark instead of the confidence dot
- [ ] **FIELD-05**: Missing fields show a dash icon with gray styling
- [ ] **FIELD-06**: Active field is visually highlighted with a blue ring/border in the field panel

### Field Navigation

- [ ] **NAV-01**: User can press Tab to advance to the next unconfirmed field (skips already-confirmed fields)
- [ ] **NAV-02**: User can press Shift+Tab to go to the previous field
- [ ] **NAV-03**: Clicking a field row sets it as the active field
- [ ] **NAV-04**: When a field becomes active, the field panel scrolls to keep it visible

### Field Editing

- [ ] **EDIT-01**: User can press Enter (or click the value) on an active field to enter edit mode
- [ ] **EDIT-02**: In edit mode, the field value is shown in an input with the text selected for easy replacement
- [ ] **EDIT-03**: User can press Enter to confirm the edited value
- [ ] **EDIT-04**: User can press Escape to cancel editing and revert to the previous value
- [ ] **EDIT-05**: User can press Tab while editing to confirm the edit and advance to the next field
- [ ] **EDIT-06**: Editing a field increments its `dataVersion` counter
- [ ] **EDIT-07**: Keyboard shortcuts (Tab, Space, +/-) are suppressed while in edit mode

### Field Validation

- [ ] **VAL-01**: User can press Space on an active (non-editing) field to mark it as confirmed (`operatorConfirmed = true`)
- [ ] **VAL-02**: Confirming a field sets `validationSource` to "user"
- [ ] **VAL-03**: Tab navigation skips fields where `operatorConfirmed` is true
- [ ] **VAL-04**: "Confirm All" button marks all remaining unconfirmed fields as confirmed

### Bounding Box Overlays

- [ ] **BBOX-01**: When a field is active, its token-level bounding boxes are rendered as colored overlays on the document
- [ ] **BBOX-02**: If a field has no tokens, the field-level `boundingBox` is highlighted instead
- [ ] **BBOX-03**: Bounding box overlays use normalized 0-1 coordinates with percentage-based CSS positioning
- [ ] **BBOX-04**: Overlays stay correctly aligned during zoom changes
- [ ] **BBOX-05**: Only the active field's overlays are rendered (no clutter from inactive fields)

### Document-Field Synchronization

- [ ] **SYNC-01**: When a field becomes active, the document viewer scrolls to center the field's bounding box region in the viewport
- [ ] **SYNC-02**: Scroll-to-field works correctly across multi-page PDF documents
- [ ] **SYNC-03**: Scroll animation is smooth (not an instant jump)

### Data Model

- [ ] **DATA-01**: App consumes an ExtractionResult JSON with documentId, document metadata, and fieldGroups containing fields
- [ ] **DATA-02**: Each field has: id, label, extractedValue, confidence, ocrConfidence, operatorConfirmed, isMissing, dataVersion, validationSource, boundingBox, and tokens array
- [ ] **DATA-03**: All bounding box coordinates are normalized 0-1 relative to page dimensions
- [ ] **DATA-04**: Sample data includes a realistic multi-group invoice extraction with varying confidence levels

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Advanced Editing
- **ADV-01**: User can draw a custom bounding box on the document to re-extract a field value
- **ADV-02**: User can select tokens directly on the document to populate a field
- **ADV-03**: User can see alternative extraction suggestions for a field

### Table Support
- **TBL-01**: App supports multivalue/tuple fields for line item tables
- **TBL-02**: User can navigate table cells with arrow keys
- **TBL-03**: User can add/remove rows in table fields

### Document Tools
- **TOOL-01**: User can rotate document pages
- **TOOL-02**: User can toggle between image view and OCR text view
- **TOOL-03**: User can search within the document text

### Workflow
- **WFLOW-01**: App supports annotation status workflow (to_review -> confirmed -> exported)
- **WFLOW-02**: App supports batch validation (queue of multiple documents)
- **WFLOW-03**: User can save validation progress as a draft

## Out of Scope

| Feature | Reason |
|---------|--------|
| Real-time collaboration | Single operator workflow -- adds massive complexity |
| Backend API / database | Frontend-only for v1 -- consumes JSON input |
| Document upload / OCR | Post-extraction validation only |
| Mobile / responsive layout | Desktop-only validation workflow |
| Authentication / user management | Standalone tool, no users |
| Custom ML model training | Completely different domain |
| Draggable split-pane resizer | Nice to have but not essential for v1 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DATA-01 | Phase 1 | Pending |
| DATA-02 | Phase 1 | Pending |
| DATA-03 | Phase 1 | Pending |
| DATA-04 | Phase 1 | Pending |
| LAYOUT-01 | Phase 2 | Pending |
| LAYOUT-02 | Phase 2 | Pending |
| LAYOUT-03 | Phase 2 | Pending |
| FIELD-01 | Phase 3 | Pending |
| FIELD-02 | Phase 3 | Pending |
| FIELD-03 | Phase 3 | Pending |
| FIELD-04 | Phase 3 | Pending |
| FIELD-05 | Phase 3 | Pending |
| FIELD-06 | Phase 3 | Pending |
| NAV-01 | Phase 4 | Pending |
| NAV-02 | Phase 4 | Pending |
| NAV-03 | Phase 4 | Pending |
| NAV-04 | Phase 4 | Pending |
| EDIT-01 | Phase 5 | Pending |
| EDIT-02 | Phase 5 | Pending |
| EDIT-03 | Phase 5 | Pending |
| EDIT-04 | Phase 5 | Pending |
| EDIT-05 | Phase 5 | Pending |
| EDIT-06 | Phase 5 | Pending |
| EDIT-07 | Phase 5 | Pending |
| VAL-01 | Phase 6 | Pending |
| VAL-02 | Phase 6 | Pending |
| VAL-03 | Phase 6 | Pending |
| VAL-04 | Phase 6 | Pending |
| DOC-01 | Phase 7 | Pending |
| DOC-02 | Phase 7 | Pending |
| DOC-03 | Phase 7 | Pending |
| DOC-04 | Phase 7 | Pending |
| DOC-05 | Phase 7 | Pending |
| BBOX-01 | Phase 8 | Pending |
| BBOX-02 | Phase 8 | Pending |
| BBOX-03 | Phase 8 | Pending |
| BBOX-04 | Phase 8 | Pending |
| BBOX-05 | Phase 8 | Pending |
| SYNC-01 | Phase 9 | Pending |
| SYNC-02 | Phase 9 | Pending |
| SYNC-03 | Phase 9 | Pending |

**Coverage:**
- v1 requirements: 41 total
- Mapped to phases: 41
- Unmapped: 0

---
*Requirements defined: 2026-02-18*
*Last updated: 2026-02-18 after roadmap creation*
