import type { ExtractionResult, Field } from '../types/extraction';

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

export interface ValidationState {
  result: ExtractionResult;
  fieldOrder: string[]; // flat array of field IDs in group order
  activeFieldId: string | null;
  isEditing: boolean;
  zoom: number; // 1.0 = 100%
}

// ---------------------------------------------------------------------------
// Actions (discriminated union)
// ---------------------------------------------------------------------------

export type ValidationAction =
  | { type: 'SET_ACTIVE_FIELD'; fieldId: string }
  | { type: 'NEXT_FIELD' }
  | { type: 'PREV_FIELD' }
  | { type: 'START_EDIT' }
  | { type: 'CONFIRM_EDIT'; value: string }
  | { type: 'CANCEL_EDIT' }
  | { type: 'CONFIRM_FIELD' }
  | { type: 'MARK_MISSING' }
  | { type: 'SET_ZOOM'; zoom: number }
  | { type: 'ZOOM_IN' }
  | { type: 'ZOOM_OUT' }
  | { type: 'CONFIRM_ALL_FIELDS' }
  | { type: 'CAPTURE_MISSING'; pageNumber: number; x: number; y: number }
  | { type: 'CAPTURE_VALUE'; value: string; boundingBox: { pageNumber: number; x: number; y: number; width: number; height: number } };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Flatten all field IDs from fieldGroups into a single ordered array.
 * This determines Tab-navigation order.
 */
export function buildFieldOrder(result: ExtractionResult): string[] {
  return result.fieldGroups.flatMap((group) =>
    group.fields.map((field) => field.id),
  );
}

/**
 * Build the initial state from an ExtractionResult.
 * activeFieldId is set to the first field if one exists.
 */
export function initializeState(result: ExtractionResult): ValidationState {
  const fieldOrder = buildFieldOrder(result);
  return {
    result,
    fieldOrder,
    activeFieldId: null,
    isEditing: false,
    zoom: 1.0,
  };
}

/**
 * Immutably update the currently-active field within the nested fieldGroups.
 * Returns the state unchanged when there is no active field.
 */
function updateField(
  state: ValidationState,
  updater: (field: Field) => Field,
): ValidationState {
  if (state.activeFieldId === null) return state;
  const activeId = state.activeFieldId;

  return {
    ...state,
    result: {
      ...state.result,
      fieldGroups: state.result.fieldGroups.map((group) => ({
        ...group,
        fields: group.fields.map((field) =>
          field.id === activeId ? updater(field) : field,
        ),
      })),
    },
  };
}

/**
 * Look up a field by ID across all field groups.
 * Returns undefined if no match is found.
 */
function findFieldById(
  result: ExtractionResult,
  fieldId: string,
): Field | undefined {
  for (const group of result.fieldGroups) {
    for (const field of group.fields) {
      if (field.id === fieldId) return field;
    }
  }
  return undefined;
}

/** Clamp a number between min and max (inclusive). */
function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

export function validationReducer(
  state: ValidationState,
  action: ValidationAction,
): ValidationState {
  switch (action.type) {
    case 'SET_ACTIVE_FIELD': {
      return {
        ...state,
        activeFieldId: action.fieldId,
        isEditing: false,
      };
    }

    case 'NEXT_FIELD': {
      const { fieldOrder, activeFieldId, result } = state;
      if (fieldOrder.length === 0) return state;

      // If no field is active, select the first unconfirmed field
      if (activeFieldId === null) {
        for (let i = 0; i < fieldOrder.length; i++) {
          const field = findFieldById(result, fieldOrder[i]);
          if (field && !field.operatorConfirmed) {
            return { ...state, activeFieldId: fieldOrder[i], isEditing: false };
          }
        }
        return { ...state, activeFieldId: fieldOrder[0], isEditing: false };
      }

      const currentIndex = fieldOrder.indexOf(activeFieldId);

      // Search forward for the next unconfirmed field, skipping confirmed ones
      for (let i = currentIndex + 1; i < fieldOrder.length; i++) {
        const field = findFieldById(result, fieldOrder[i]);
        if (field && !field.operatorConfirmed) {
          return {
            ...state,
            activeFieldId: fieldOrder[i],
            isEditing: false,
          };
        }
      }

      // No unconfirmed field found after current position -- stay on current field
      return { ...state, isEditing: false };
    }

    case 'PREV_FIELD': {
      const { fieldOrder, activeFieldId } = state;
      if (activeFieldId === null || fieldOrder.length === 0) return state;
      const currentIndex = fieldOrder.indexOf(activeFieldId);
      const prevIndex = Math.max(currentIndex - 1, 0);
      return {
        ...state,
        activeFieldId: fieldOrder[prevIndex],
        isEditing: false,
      };
    }

    case 'START_EDIT': {
      if (state.activeFieldId === null) return state;
      return { ...state, isEditing: true };
    }

    case 'CONFIRM_EDIT': {
      if (state.activeFieldId === null) return state;
      const newState = updateField(state, (field) => ({
        ...field,
        extractedValue: action.value,
        dataVersion: field.dataVersion + 1,
        validationSource: 'user',
      }));
      return { ...newState, isEditing: false };
    }

    case 'CANCEL_EDIT': {
      return { ...state, isEditing: false };
    }

    case 'CONFIRM_FIELD': {
      if (state.activeFieldId === null) return state;
      const newState = updateField(state, (field) => ({
        ...field,
        operatorConfirmed: true,
        validationSource: 'user',
      }));
      return { ...newState, isEditing: false };
    }

    case 'MARK_MISSING': {
      if (state.activeFieldId === null) return state;
      return updateField(state, (field) => ({
        ...field,
        isMissing: true,
      }));
    }

    case 'SET_ZOOM': {
      return { ...state, zoom: clamp(action.zoom, 0.25, 4.0) };
    }

    case 'ZOOM_IN': {
      return { ...state, zoom: clamp(state.zoom * 1.25, 0.25, 4.0) };
    }

    case 'ZOOM_OUT': {
      return { ...state, zoom: clamp(state.zoom * 0.8, 0.25, 4.0) };
    }

    case 'CONFIRM_ALL_FIELDS': {
      return {
        ...state,
        result: {
          ...state.result,
          fieldGroups: state.result.fieldGroups.map((group) => ({
            ...group,
            fields: group.fields.map((field) =>
              field.operatorConfirmed
                ? field
                : {
                    ...field,
                    operatorConfirmed: true,
                    validationSource: 'user' as const,
                  },
            ),
          })),
        },
        isEditing: false,
      };
    }

    case 'CAPTURE_VALUE': {
      if (state.activeFieldId === null) return state;
      const bbox = action.boundingBox;
      const newState = updateField(state, (field) => ({
        ...field,
        extractedValue: action.value,
        isMissing: false,
        dataVersion: field.dataVersion + 1,
        validationSource: 'user' as const,
        boundingBox: bbox,
        tokens: [{ text: action.value, boundingBox: bbox }],
      }));
      return { ...newState, isEditing: false };
    }

    case 'CAPTURE_MISSING': {
      if (state.activeFieldId === null) return state;
      const activeField = findFieldById(state.result, state.activeFieldId);
      if (!activeField || !activeField.isMissing) return state;

      // Set bounding box at click position and enter edit mode
      const newState = updateField(state, (field) => ({
        ...field,
        isMissing: false,
        boundingBox: {
          pageNumber: action.pageNumber,
          x: Math.max(0, action.x - 0.05),
          y: Math.max(0, action.y - 0.005),
          width: 0.1,
          height: 0.012,
        },
        tokens: [
          {
            text: '',
            boundingBox: {
              pageNumber: action.pageNumber,
              x: Math.max(0, action.x - 0.05),
              y: Math.max(0, action.y - 0.005),
              width: 0.1,
              height: 0.012,
            },
          },
        ],
      }));
      return { ...newState, isEditing: true };
    }

    default: {
      // Exhaustiveness check -- will cause a compile error if a case is missed.
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
}
