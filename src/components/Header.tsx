import { useValidation } from '../context/useValidation';

export function Header() {
  const { state, dispatch } = useValidation();

  const zoomPercent = Math.round(state.zoom * 100);

  return (
    <header className="h-12 bg-gray-900 flex items-center justify-between px-4 shrink-0">
      {/* Left: App title */}
      <div className="flex items-center gap-2">
        <h1 className="text-sm font-bold text-white tracking-wide">
          Validation Station
        </h1>
      </div>

      {/* Center: Zoom controls */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => dispatch({ type: 'ZOOM_OUT' })}
          className="px-2 py-1 text-xs font-medium text-gray-300 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
          aria-label="Zoom out"
        >
          -
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: 'SET_ZOOM', zoom: 1.0 })}
          className="px-3 py-1 text-xs font-mono text-gray-300 bg-gray-700 rounded hover:bg-gray-600 transition-colors min-w-[4rem] text-center"
          aria-label="Reset zoom to 100%"
        >
          {zoomPercent}%
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: 'ZOOM_IN' })}
          className="px-2 py-1 text-xs font-medium text-gray-300 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
          aria-label="Zoom in"
        >
          +
        </button>
      </div>

      {/* Right: Confirm All */}
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => dispatch({ type: 'CONFIRM_ALL_FIELDS' })}
          className="px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 rounded hover:bg-emerald-700 transition-colors"
        >
          Confirm All
        </button>
      </div>
    </header>
  );
}
