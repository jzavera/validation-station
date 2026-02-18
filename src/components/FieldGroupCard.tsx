import type { FieldGroup } from '../types/extraction';
import { FieldRow } from './FieldRow';

interface FieldGroupCardProps {
  group: FieldGroup;
  activeFieldId: string | null;
  onSelectField: (fieldId: string) => void;
}

/**
 * Renders a field group with a header label and a list of FieldRow children.
 */
export function FieldGroupCard({
  group,
  activeFieldId,
  onSelectField,
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
            onSelect={onSelectField}
          />
        ))}
      </div>
    </section>
  );
}
