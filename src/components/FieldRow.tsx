import clsx from 'clsx';
import type { Field } from '../types/extraction';
import { ConfidenceBadge } from './ConfidenceBadge';

interface FieldRowProps {
  field: Field;
  isActive: boolean;
  onSelect: (fieldId: string) => void;
}

/**
 * Single field row showing confidence badge, label, and extracted value.
 * Click to select (SET_ACTIVE_FIELD). Active field gets a blue ring.
 */
export function FieldRow({ field, isActive, onSelect }: FieldRowProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(field.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(field.id);
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
      />

      {/* Field label */}
      <span className="text-xs text-gray-500 w-28 shrink-0 truncate">
        {field.label}
      </span>

      {/* Extracted value */}
      {field.isMissing ? (
        <span className="text-sm text-gray-400 italic">Missing</span>
      ) : (
        <span className="text-sm text-gray-900 truncate">
          {field.extractedValue}
        </span>
      )}
    </div>
  );
}
