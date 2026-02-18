import { useEffect } from 'react';
import { ValidationProvider } from './context/ValidationProvider';
import { useValidation } from './context/useValidation';
import { sampleExtractionResult } from './data/sampleData';

function AppContent() {
  const { state, dispatch } = useValidation();

  // Expose state and dispatch on window for browser-console testing
  useEffect(() => {
    (window as any).__dispatch = dispatch;
    (window as any).__state = state;
  }, [dispatch, state]);

  // Find the active field label for display
  const activeField = state.activeFieldId
    ? state.result.fieldGroups
        .flatMap((g) => g.fields)
        .find((f) => f.id === state.activeFieldId)
    : null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Validation Station
        </h1>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500 font-medium">Active Field</span>
            <span className="text-gray-900 font-mono">
              {state.activeFieldId ?? 'none'}
            </span>
          </div>

          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500 font-medium">Field Label</span>
            <span className="text-gray-900">
              {activeField?.label ?? '-'}
            </span>
          </div>

          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500 font-medium">Zoom</span>
            <span className="text-gray-900 font-mono">
              {(state.zoom * 100).toFixed(0)}%
            </span>
          </div>

          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500 font-medium">Total Fields</span>
            <span className="text-gray-900 font-mono">
              {state.fieldOrder.length}
            </span>
          </div>

          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500 font-medium">Editing</span>
            <span
              className={`font-mono ${state.isEditing ? 'text-amber-600' : 'text-gray-400'}`}
            >
              {state.isEditing ? 'true' : 'false'}
            </span>
          </div>
        </div>

        <p className="mt-6 text-xs text-gray-400 leading-relaxed">
          Open the browser console and use{' '}
          <code className="bg-gray-100 px-1 rounded">__dispatch</code> /{' '}
          <code className="bg-gray-100 px-1 rounded">__state</code> to test
          state management.
        </p>
      </div>
    </div>
  );
}

function App() {
  return (
    <ValidationProvider extractionResult={sampleExtractionResult}>
      <AppContent />
    </ValidationProvider>
  );
}

export default App;
