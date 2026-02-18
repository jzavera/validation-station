# Summary 04-01: Field Navigation

**Phase:** 04-field-navigation
**Completed:** 2026-02-18
**Duration:** ~4min
**Status:** Complete

## What Was Built

### New Files

| File | Purpose |
|------|---------|
| `src/hooks/useKeyboardNavigation.ts` | Global keydown listener: Tab dispatches NEXT_FIELD, Shift+Tab dispatches PREV_FIELD. Skips interception when `isEditing` is true. Cleans up on unmount. |

### Modified Files

| File | Change |
|------|--------|
| `src/context/validationReducer.ts` | Added `findFieldById` helper. Updated `NEXT_FIELD` to skip confirmed fields (searches forward for next unconfirmed). |
| `src/components/FieldRow.tsx` | Added ref + useEffect for auto-scroll: calls `scrollIntoView({ behavior: 'smooth', block: 'nearest' })` when `isActive` becomes true. |
| `src/App.tsx` | Imported and wired `useKeyboardNavigation(state, dispatch)` in AppContent. |

## Requirements Satisfied

- **NAV-01**: Tab advances to next unconfirmed field, skipping confirmed ones
- **NAV-02**: Shift+Tab goes to previous field (regardless of confirmed status, per Rossum pattern)
- **NAV-03**: Clicking a field row sets it as active (already working from Phase 3 -- SET_ACTIVE_FIELD on click)
- **NAV-04**: Active field auto-scrolls into view using `scrollIntoView` with smooth behavior

## Design Decisions

- `findFieldById` helper iterates all field groups to look up a field by ID for the confirmed-check in NEXT_FIELD
- NEXT_FIELD stays on current field if all remaining fields are confirmed (no wrapping)
- PREV_FIELD does not skip confirmed fields (matches Rossum pattern where Shift+Tab goes to previous regardless)
- `useKeyboardNavigation` uses `state.isEditing` to avoid intercepting Tab when an inline editor is active (Phase 5 integration point)
- `block: 'nearest'` for scrollIntoView avoids unnecessary scrolling when the field is already visible
- Hook wired in AppContent (inside ValidationProvider) so it has access to state and dispatch

## Verification

- `npx tsc --noEmit` passes with no errors
- `npm run build` succeeds (951ms build time)
- Tab/Shift+Tab navigation dispatches correct actions (verifiable in browser console via `__state`)
- Auto-scroll triggers on field activation via both Tab navigation and click
