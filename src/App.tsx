import { useEffect } from 'react';
import { ValidationProvider } from './context/ValidationProvider';
import { useValidation } from './context/useValidation';
import { sampleExtractionResult } from './data/sampleData';
import { Header } from './components/Header';
import { StatusBar } from './components/StatusBar';
import { FieldPanel } from './components/FieldPanel';

function AppContent() {
  const { state, dispatch } = useValidation();

  // Expose state and dispatch on window for browser-console testing
  useEffect(() => {
    (window as any).__dispatch = dispatch;
    (window as any).__state = state;
  }, [dispatch, state]);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      <Header />

      <main className="flex-1 flex min-h-0">
        {/* Left panel: Document viewer (55%) */}
        <div className="w-[55%] bg-gray-200 overflow-auto flex items-center justify-center">
          <span className="text-sm text-gray-500 select-none">
            Document Viewer
          </span>
        </div>

        {/* Vertical divider */}
        <div className="w-px bg-gray-300 shrink-0" />

        {/* Right panel: Field panel (45%) */}
        <div className="w-[45%] bg-white overflow-y-auto">
          <FieldPanel />
        </div>
      </main>

      <StatusBar />
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
