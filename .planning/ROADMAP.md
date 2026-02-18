# Roadmap: Validation Station

## Overview

Validation Station is a standalone React + TypeScript app for human validation of document extraction results. The roadmap delivers the app through 9 phases, starting with the foundational data model and state management, building the two-panel shell, layering in field display and interaction (navigation, editing, validation), then adding document rendering with bounding box overlays, and finally wiring document-field synchronization. Each phase delivers one complete, verifiable capability.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation** - Project scaffold, TypeScript types, sample data, and state management
- [x] **Phase 2: App Shell** - Two-panel layout with header and status bar
- [x] **Phase 3: Field Display** - Field groups with confidence indicators and active field highlighting
- [x] **Phase 4: Field Navigation** - Tab/Shift+Tab/click navigation between fields
- [x] **Phase 5: Field Editing** - Inline editing with Enter/Escape/Tab and dataVersion tracking
- [x] **Phase 6: Field Validation** - Space to confirm, Confirm All, smart Tab skip of confirmed fields
- [ ] **Phase 7: Document Rendering** - PDF and image rendering with zoom controls
- [ ] **Phase 8: Bounding Box Overlays** - Token-level and field-level highlights on the document
- [ ] **Phase 9: Document-Field Synchronization** - Active field triggers document scroll-to-region

## Phase Details

### Phase 1: Foundation
**Goal**: The app compiles and runs with a complete data model, sample extraction data, and centralized state management ready for all downstream features
**Depends on**: Nothing (first phase)
**Requirements**: DATA-01, DATA-02, DATA-03, DATA-04
**Success Criteria** (what must be TRUE):
  1. Running `npm run dev` starts the app with no errors and Tailwind CSS styles are applied
  2. TypeScript types for ExtractionResult, Field, BoundingBox, and TokenBox compile cleanly with all properties defined
  3. Sample data loads in the app representing a realistic multi-group invoice with fields at varying confidence levels
  4. Dispatching state actions (SET_ACTIVE_FIELD, NEXT_FIELD, SET_ZOOM) from the browser console updates state correctly via the ValidationProvider context
**Plans:** 2 plans

Plans:
- [x] 01-01-PLAN.md — Scaffold Vite + React 19 + TypeScript project with Tailwind CSS v4, define extraction data model types, and create sample invoice data
- [x] 01-02-PLAN.md — Build ValidationProvider with useReducer, all state actions, useValidation hook, and wire into App with console-testable dispatch

### Phase 2: App Shell
**Goal**: The operator sees a full-screen two-panel layout with a header bar and status bar, ready to host document and field content
**Depends on**: Phase 1
**Requirements**: LAYOUT-01, LAYOUT-02, LAYOUT-03
**Success Criteria** (what must be TRUE):
  1. App renders a full-screen view split into a left panel (55%) and right panel (45%) with no scrollbar on the outer shell
  2. Header bar displays the app title, zoom control buttons (+/-/reset), and a "Confirm All" button
  3. Status bar at the bottom shows the current field position (e.g., "Field 1/12") and keyboard shortcut hints
**Plans**: 1 plan

Plans:
- [x] 02-01-PLAN.md — Build full-screen App Shell with Header (title, zoom controls, Confirm All), two-panel split layout (55/45), StatusBar (field position, keyboard hints), and wire to state

### Phase 3: Field Display
**Goal**: The operator can see all extracted fields organized by groups, with confidence indicators showing extraction quality at a glance
**Depends on**: Phase 2
**Requirements**: FIELD-01, FIELD-02, FIELD-03, FIELD-04, FIELD-05, FIELD-06
**Success Criteria** (what must be TRUE):
  1. Fields appear in the right panel grouped under labeled section headers matching the field group names from the extraction data
  2. Each field row shows a confidence dot (red for <0.7, yellow for 0.7-0.9, green for >=0.9), the field label, and the extracted value
  3. Confirmed fields display a green checkmark instead of the confidence dot, and missing fields show a dash icon with gray styling
  4. Clicking a field row highlights it with a visible blue ring/border, distinguishing the active field from all others
**Plans**: 1 plan

Plans:
- [x] 03-01-PLAN.md — Build confidence utility, ConfidenceBadge, FieldRow, FieldGroupCard, FieldPanel components, and wire into App right panel

### Phase 4: Field Navigation
**Goal**: The operator can navigate between fields using keyboard and mouse, with the field panel scrolling to keep the active field visible
**Depends on**: Phase 3
**Requirements**: NAV-01, NAV-02, NAV-03, NAV-04
**Success Criteria** (what must be TRUE):
  1. Pressing Tab advances focus to the next unconfirmed field, skipping any confirmed fields
  2. Pressing Shift+Tab moves focus to the previous field
  3. Clicking any field row in the panel sets it as the active field
  4. When a field becomes active (by Tab or click), the field panel automatically scrolls so the active field is visible
**Plans**: 1 plan

Plans:
- [x] 04-01-PLAN.md -- useKeyboardNavigation hook, NEXT_FIELD skip-confirmed logic, FieldRow auto-scroll, wire into App

### Phase 5: Field Editing
**Goal**: The operator can edit any field value inline with full keyboard control, and edits are tracked via the dataVersion counter
**Depends on**: Phase 4
**Requirements**: EDIT-01, EDIT-02, EDIT-03, EDIT-04, EDIT-05, EDIT-06, EDIT-07
**Success Criteria** (what must be TRUE):
  1. Pressing Enter (or clicking the value) on an active field enters edit mode, showing an input with the text pre-selected for easy replacement
  2. In edit mode, pressing Enter confirms the new value and pressing Escape reverts to the previous value
  3. Pressing Tab while editing confirms the edit and advances to the next unconfirmed field in one action
  4. Each confirmed edit increments the field's dataVersion counter (visible in state)
  5. While in edit mode, keyboard shortcuts (Tab for navigation, Space for confirm, +/- for zoom) are suppressed and do not trigger their normal actions
**Plans**: 1 plan

Plans:
- [x] 05-01-PLAN.md -- EditableValue component, FieldRow editing integration, useKeyboardNavigation Enter/+/-/Space support

### Phase 6: Field Validation
**Goal**: The operator can confirm individual fields or all remaining fields at once, with confirmed fields tracked and skipped during navigation
**Depends on**: Phase 5
**Requirements**: VAL-01, VAL-02, VAL-03, VAL-04
**Success Criteria** (what must be TRUE):
  1. Pressing Space on an active (non-editing) field marks it as confirmed: the confidence dot changes to a green checkmark
  2. Confirming a field sets operatorConfirmed to true and validationSource to "user" in the state
  3. Tab navigation skips fields where operatorConfirmed is true (smart skip behavior)
  4. Clicking "Confirm All" in the header marks every remaining unconfirmed field as confirmed in one action
**Plans**: 1 plan

Plans:
- [x] 06-01-PLAN.md -- Wire Space key to dispatch CONFIRM_FIELD in useKeyboardNavigation

### Phase 7: Document Rendering
**Goal**: The operator can view the source document (PDF or image) in the left panel with zoom controls, and the correct renderer is selected automatically
**Depends on**: Phase 2
**Requirements**: DOC-01, DOC-02, DOC-03, DOC-04, DOC-05
**Success Criteria** (what must be TRUE):
  1. A PDF extraction result renders all pages in a scrollable container using react-pdf in the left panel
  2. An image extraction result (PNG/JPG) renders the image in the left panel with the same container structure
  3. The app automatically dispatches to the correct renderer (PDF or image) based on the document.type field in the extraction result
  4. Zoom in/out works via header buttons and keyboard shortcuts (+/-), and the zoom level persists when navigating between fields
**Plans**: TBD

Plans:
- [ ] 07-01: TBD

### Phase 8: Bounding Box Overlays
**Goal**: The operator can see colored highlight overlays on the document showing exactly where the active field's value was extracted from
**Depends on**: Phase 7
**Requirements**: BBOX-01, BBOX-02, BBOX-03, BBOX-04, BBOX-05
**Success Criteria** (what must be TRUE):
  1. When a field is active, its token-level bounding boxes appear as colored rectangles overlaid on the document at the correct positions
  2. If a field has no tokens, the field-level boundingBox is highlighted instead (fallback behavior)
  3. Overlays use normalized 0-1 coordinates with percentage-based CSS positioning, staying correctly aligned during zoom changes
  4. Only the active field's overlays are rendered on the document (no visual clutter from inactive fields)
**Plans**: TBD

Plans:
- [ ] 08-01: TBD

### Phase 9: Document-Field Synchronization
**Goal**: The operator experiences seamless connection between the field panel and document viewer -- activating a field automatically scrolls the document to show the relevant extraction region
**Depends on**: Phase 8
**Requirements**: SYNC-01, SYNC-02, SYNC-03
**Success Criteria** (what must be TRUE):
  1. When a field becomes active, the document viewer scrolls to center the field's bounding box region in the viewport
  2. Scroll-to-field works correctly across pages in a multi-page PDF document
  3. The scroll animation is smooth (not an instant jump), providing clear visual feedback of the document moving to the relevant region
**Plans**: TBD

Plans:
- [ ] 09-01: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8 -> 9

Note: Phases 3-6 (field interactions) and Phase 7 (document rendering) share only Phase 2 as a dependency. However, for a solo workflow, sequential execution avoids context-switching overhead. The recommended order interleaves document rendering after field validation to provide a complete field workflow before adding the document side.

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 2/2 | Complete | 2026-02-18 |
| 2. App Shell | 1/1 | Complete | 2026-02-18 |
| 3. Field Display | 1/1 | Complete | 2026-02-18 |
| 4. Field Navigation | 1/1 | Complete | 2026-02-18 |
| 5. Field Editing | 1/1 | Complete | 2026-02-18 |
| 6. Field Validation | 1/1 | Complete | 2026-02-18 |
| 7. Document Rendering | 0/TBD | Not started | - |
| 8. Bounding Box Overlays | 0/TBD | Not started | - |
| 9. Document-Field Sync | 0/TBD | Not started | - |
