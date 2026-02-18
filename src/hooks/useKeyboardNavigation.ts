import { useEffect } from 'react';
import type { ValidationState, ValidationAction } from '../context/validationReducer';

/**
 * Global keyboard listener for field navigation.
 *
 * - Tab → dispatch NEXT_FIELD (advances to next unconfirmed field)
 * - Shift+Tab → dispatch PREV_FIELD (goes to previous field)
 *
 * When `state.isEditing` is true, Tab/Shift+Tab are NOT intercepted
 * so the EditableValue component (Phase 5) can handle them instead.
 *
 * Tab's default browser behavior (focus cycling) is always prevented
 * when we handle the event.
 */
export function useKeyboardNavigation(
  state: ValidationState,
  dispatch: React.Dispatch<ValidationAction>,
): void {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't intercept while editing -- let the input handle Tab
      if (state.isEditing) return;

      if (e.key === 'Tab') {
        e.preventDefault();

        if (e.shiftKey) {
          dispatch({ type: 'PREV_FIELD' });
        } else {
          dispatch({ type: 'NEXT_FIELD' });
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [state.isEditing, dispatch]);
}
