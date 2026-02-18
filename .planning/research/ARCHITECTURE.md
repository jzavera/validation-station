# Architecture Research: Validation Station

## Component Architecture (informed by Rossum, UiPath, ABBYY patterns)

### Major Components

```
┌─────────────────────────────────────────────────────┐
│                     App Shell                        │
│  ┌─────────────────────────────────────────────────┐│
│  │              Header Bar                          ││
│  │  Title | Zoom Controls | Confirm All | Status    ││
│  └─────────────────────────────────────────────────┘│
│  ┌───────────────────┬─────────────────────────────┐│
│  │                   │                              ││
│  │  Document Viewer  │     Field Panel              ││
│  │  ┌─────────────┐  │  ┌────────────────────────┐  ││
│  │  │ PageWrapper  │  │  │ FieldGroupCard         │  ││
│  │  │ ┌─────────┐ │  │  │  FieldRow + ConfBadge  │  ││
│  │  │ │ PDF/Img │ │  │  │  EditableValue         │  ││
│  │  │ │ Page    │ │  │  └────────────────────────┘  ││
│  │  │ ├─────────┤ │  │  ┌────────────────────────┐  ││
│  │  │ │ BBox    │ │  │  │ FieldGroupCard         │  ││
│  │  │ │ Overlay │ │  │  │  ...                   │  ││
│  │  │ └─────────┘ │  │  └────────────────────────┘  ││
│  │  └─────────────┘  │                              ││
│  └───────────────────┴─────────────────────────────┘│
│  ┌─────────────────────────────────────────────────┐│
│  │              Status Bar                          ││
│  └─────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

### Component Boundaries

1. **ValidationProvider** (context boundary)
   - Owns all state: activeFieldId, isEditing, editedValues, zoom
   - Provides dispatch to all children
   - No component talks to another directly — all communication through state

2. **DocumentViewer** (rendering boundary)
   - Dispatches to PdfViewer or ImageViewer based on document.type
   - Manages scroll container ref (shared with useDocumentScroll)
   - Each page wrapped in PageWrapper (relative container for overlay)

3. **BoundingBoxOverlay** (visual boundary)
   - Absolutely positioned inside PageWrapper
   - Uses percentage-based CSS from normalized 0–1 coordinates
   - Only renders overlays for the active field (reduces visual noise)

4. **FieldPanel** (interaction boundary)
   - Scrollable list of FieldGroupCards
   - Each FieldRow handles its own click/edit/Tab interactions
   - Dispatches actions to ValidationProvider

### Data Flow

```
ExtractionResult JSON
        │
        ▼
  ValidationProvider (state)
        │
   ┌────┴────┐
   ▼         ▼
DocumentViewer  FieldPanel
   │              │
   │  reads:      │  reads:
   │  - activeField  │  - fieldGroups
   │  - zoom         │  - activeFieldId
   │                 │  - isEditing
   │  dispatches:    │
   │  (none - read   │  dispatches:
   │   only viewer)  │  - SET_ACTIVE_FIELD
   │                 │  - START_EDIT
   ▼                 │  - CONFIRM_EDIT
BoundingBoxOverlay   │  - CONFIRM_FIELD
   reads:            │  - NEXT_FIELD
   - activeField     ▼
   - pageWidthPx     EditableValue
   - pageHeightPx    - local edit state
                     - dispatches CONFIRM/CANCEL
```

### Build Order (dependencies)

1. **Types + Sample Data** — no dependencies, foundation for everything
2. **ValidationProvider** — depends on types, needed by all UI
3. **App Shell + Split Pane** — layout structure
4. **FieldPanel** (right pane) — depends on provider, can develop without document viewer
5. **PdfViewer** (left pane) — depends on react-pdf setup, independent of field panel
6. **ImageViewer** — simple, parallel with PdfViewer
7. **BoundingBoxOverlay** — depends on PageWrapper dimensions being available
8. **useDocumentScroll** — depends on both viewer + field panel being wired
9. **Keyboard Navigation** — depends on field panel + provider
10. **Zoom Controls** — depends on viewer being renderable
11. **Status Bar** — depends on provider state

### Key Architectural Decisions

| Decision | Pattern Source | Rationale |
|----------|---------------|-----------|
| Percentage-based overlay positioning | Google/Textract normalized coords | Zoom-independent, no pixel recalculation |
| Single scroll container for document | Rossum | Simple scroll-to logic, page offsets calculable |
| Active field as single source of truth | UiPath | Both panels read same state, guaranteed sync |
| Field panel drives all interactions | Rossum, UiPath | Document viewer is read-only display |
| Page-level overlay components | All platforms | Each page has its own overlay, scoped rendering |
