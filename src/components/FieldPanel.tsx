import { useValidation } from '../context/useValidation';
import { FieldGroupCard } from './FieldGroupCard';

/**
 * Right-panel content: scrollable list of field groups.
 * Maps through fieldGroups from state and renders a FieldGroupCard for each.
 */
export function FieldPanel() {
  const { state, dispatch } = useValidation();

  const { result, activeFieldId, isEditing } = state;

  const handleSelectField = (fieldId: string) => {
    dispatch({ type: 'SET_ACTIVE_FIELD', fieldId });
  };

  return (
    <div className="h-full overflow-y-auto p-2">
      {result.fieldGroups.map((group) => (
        <FieldGroupCard
          key={group.id}
          group={group}
          activeFieldId={activeFieldId}
          isEditing={isEditing}
          onSelectField={handleSelectField}
          dispatch={dispatch}
        />
      ))}
    </div>
  );
}
