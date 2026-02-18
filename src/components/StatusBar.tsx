import { useValidation } from '../context/useValidation';

export function StatusBar() {
  const { state } = useValidation();

  const { activeFieldId, fieldOrder } = state;

  let fieldPosition: string;
  if (activeFieldId === null) {
    fieldPosition = 'No field selected';
  } else {
    const currentIndex = fieldOrder.indexOf(activeFieldId);
    fieldPosition = `Field ${currentIndex + 1} / ${fieldOrder.length}`;
  }

  return (
    <footer className="h-8 bg-gray-100 border-t border-gray-200 flex items-center justify-between px-4 shrink-0">
      {/* Left: Field position */}
      <span className="text-xs font-medium text-gray-600">
        {fieldPosition}
      </span>

      {/* Right: Keyboard hints */}
      <span className="text-xs text-gray-400">
        Tab: Next &middot; Shift+Tab: Prev &middot; Space: Confirm &middot;
        Enter: Edit &middot; +/-: Zoom
      </span>
    </footer>
  );
}
