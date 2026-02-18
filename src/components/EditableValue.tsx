import { useState, useEffect, useRef } from 'react';

interface EditableValueProps {
  value: string;
  isEditing: boolean;
  onStartEdit: () => void;
  onConfirm: (newValue: string) => void;
  onCancel: () => void;
  onTabConfirm: (newValue: string) => void;
}

/**
 * Inline-editable field value.
 *
 * When NOT editing: renders a clickable <span> showing the current value.
 * When editing: renders an <input> that auto-focuses and selects all text.
 *
 * Keyboard handling inside the input:
 *   - Enter  -> confirm the edit (onConfirm)
 *   - Escape -> cancel and revert (onCancel)
 *   - Tab    -> confirm and advance to next field (onTabConfirm)
 *
 * All keydown events are stopped from propagating so the global
 * keyboard handler does not intercept them (EDIT-07).
 */
export function EditableValue({
  value,
  isEditing,
  onStartEdit,
  onConfirm,
  onCancel,
  onTabConfirm,
}: EditableValueProps) {
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync local value when the prop changes (e.g., after cancel reverts)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Auto-focus and select all text when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  if (!isEditing) {
    return (
      <span
        className="text-sm text-gray-900 truncate cursor-pointer hover:underline"
        onClick={(e) => {
          e.stopPropagation();
          onStartEdit();
        }}
      >
        {value}
      </span>
    );
  }

  return (
    <input
      ref={inputRef}
      type="text"
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onKeyDown={(e) => {
        // Stop propagation so global keyboard handler ignores these keys
        e.stopPropagation();

        if (e.key === 'Enter') {
          e.preventDefault();
          onConfirm(localValue);
        } else if (e.key === 'Escape') {
          e.preventDefault();
          onCancel();
        } else if (e.key === 'Tab') {
          e.preventDefault();
          onTabConfirm(localValue);
        }
      }}
      onBlur={() => {
        // Confirm on blur to avoid losing edits when clicking elsewhere
        onConfirm(localValue);
      }}
      className="text-sm text-gray-900 w-full bg-white border border-blue-400 rounded px-1 py-0.5 outline-none ring-1 ring-blue-400"
    />
  );
}
