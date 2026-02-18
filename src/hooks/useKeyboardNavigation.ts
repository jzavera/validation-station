import { useEffect } from 'react';
import type { ValidationState, ValidationAction } from '../context/validationReducer';

/**
 * Global keyboard listener for field navigation and editing.
 *
 * When NOT editing (state.isEditing === false):
 *   - Tab       -> dispatch NEXT_FIELD (advances to next unconfirmed field)
 *   - Shift+Tab -> dispatch PREV_FIELD (goes to previous field)
 *   - Enter     -> dispatch START_EDIT (enter edit mode on active field)
 *   - Space     -> dispatch CONFIRM_FIELD (marks active field as confirmed)
 *   - +/=       -> dispatch ZOOM_IN
 *   - -         -> dispatch ZOOM_OUT
 *
 * When editing (state.isEditing === true):
 *   All shortcuts are suppressed (EDIT-07). The EditableValue component
 *   handles its own key events and stops propagation.
 */
export function useKeyboardNavigation(
  state: ValidationState,
  dispatch: React.Dispatch<ValidationAction>,
): void {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't intercept while editing -- let the input handle all keys (EDIT-07)
      if (state.isEditing) return;

      // Don't intercept if user is typing in another input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      switch (e.key) {
        case 'Tab': {
          e.preventDefault();
          if (e.shiftKey) {
            dispatch({ type: 'PREV_FIELD' });
          } else {
            dispatch({ type: 'NEXT_FIELD' });
          }
          break;
        }

        case 'Enter': {
          if (state.activeFieldId !== null) {
            e.preventDefault();
            dispatch({ type: 'START_EDIT' });
          }
          break;
        }

        case ' ': {
          if (state.activeFieldId !== null) {
            e.preventDefault();
            dispatch({ type: 'CONFIRM_FIELD' });
          }
          break;
        }

        case '+':
        case '=': {
          e.preventDefault();
          dispatch({ type: 'ZOOM_IN' });
          break;
        }

        case '-': {
          e.preventDefault();
          dispatch({ type: 'ZOOM_OUT' });
          break;
        }

        default:
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [state.isEditing, state.activeFieldId, dispatch]);
}
