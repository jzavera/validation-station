import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import type { Field } from '../types/extraction';
import type { ValidationAction } from '../context/validationReducer';
import { ConfidenceBadge } from './ConfidenceBadge';
import { EditableValue } from './EditableValue';

interface FieldRowProps {
  field: Field;
  isActive: boolean;
  isEditing: boolean;
  onSelect: (fieldId: string) => void;
  dispatch: React.Dispatch<ValidationAction>;
}

/**
 * Single field row showing confidence badge, label, and extracted value.
 *
 * Click to select (SET_ACTIVE_FIELD). Active field gets a blue ring.
 * When active, Enter or clicking the value enters edit mode.
 * EditableValue handles inline editing with Enter/Escape/Tab.
 */
export function FieldRow({ field, isActive, isEditing, onSelect, dispatch }: FieldRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the active field into view within the field panel
  useEffect(() => {
    if (isActive && rowRef.current) {
      rowRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [isActive]);

  const handleStartEdit = () => {
    if (isActive) {
      dispatch({ type: 'START_EDIT' });
    }
  };

  const handleConfirm = (newValue: string) => {
    dispatch({ type: 'CONFIRM_EDIT', value: newValue });
  };

  const handleCancel = () => {
    dispatch({ type: 'CANCEL_EDIT' });
  };

  const handleTabConfirm = (newValue: string) => {
    dispatch({ type: 'CONFIRM_EDIT', value: newValue });
    dispatch({ type: 'NEXT_FIELD' });
  };

  return (
    <div
      ref={rowRef}
      role="button"
      tabIndex={0}
      data-field-active={isActive || undefined}
      onClick={() => {
        if (!isActive) {
          onSelect(field.id);
        }
      }}
      onKeyDown={(e) => {
        // When this row has DOM focus and Enter is pressed while active but not editing,
        // start edit mode. This supplements the global handler for when the row itself
        // has focus (e.g., after click).
        if (e.key === 'Enter' && isActive && !isEditing) {
          e.preventDefault();
          e.stopPropagation();
          dispatch({ type: 'START_EDIT' });
        }
      }}
      className={clsx(
        'flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors',
        'hover:bg-blue-50',
        isActive && 'ring-2 ring-blue-500 bg-blue-50',
      )}
    >
      {/* Confidence indicator */}
      <ConfidenceBadge
        confidence={field.confidence}
        operatorConfirmed={field.operatorConfirmed}
        isMissing={field.isMissing}
        hasEmptyValue={!field.isMissing && field.extractedValue === ''}
      />

      {/* Field label */}
      <span className="text-xs text-gray-500 w-28 shrink-0 truncate">
        {field.label}
      </span>

      {/* Extracted value (editable when active + editing) */}
      {field.isMissing && !(isActive && isEditing) ? (
        <span className="text-sm text-gray-400 italic">Missing — click document to capture</span>
      ) : !field.isMissing && field.extractedValue === '' && !(isActive && isEditing) ? (
        <span className="text-sm text-red-400 italic">Empty — click text on document</span>
      ) : (
        <EditableValue
          value={field.extractedValue}
          isEditing={isActive && isEditing}
          onStartEdit={handleStartEdit}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          onTabConfirm={handleTabConfirm}
        />
      )}
    </div>
  );
}
