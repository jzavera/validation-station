import type { FieldGroup } from '../types/extraction';
import type { ValidationAction } from '../context/validationReducer';
import { FieldRow } from './FieldRow';

interface FieldGroupCardProps {
  group: FieldGroup;
  activeFieldId: string | null;
  isEditing: boolean;
  onSelectField: (fieldId: string) => void;
  dispatch: React.Dispatch<ValidationAction>;
}

/**
 * Renders a field group with a header label and a list of FieldRow children.
 */
export function FieldGroupCard({
  group,
  activeFieldId,
  isEditing,
  onSelectField,
  dispatch,
}: FieldGroupCardProps) {
  return (
    <section className="mb-4">
      {/* Group header */}
      <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider px-3 py-2 border-b border-gray-200">
        {group.label}
      </h3>

      {/* Field rows */}
      <div className="py-1">
        {group.fields.map((field) => (
          <FieldRow
            key={field.id}
            field={field}
            isActive={field.id === activeFieldId}
            isEditing={isEditing}
            onSelect={onSelectField}
            dispatch={dispatch}
          />
        ))}
      </div>
    </section>
  );
}
