import { createContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { ExtractionResult } from '../types/extraction';
import {
  validationReducer,
  initializeState,
} from './validationReducer';
import type { ValidationState, ValidationAction } from './validationReducer';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export interface ValidationContextValue {
  state: ValidationState;
  dispatch: React.Dispatch<ValidationAction>;
}

export const ValidationContext = createContext<ValidationContextValue | null>(
  null,
);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface ValidationProviderProps {
  children: ReactNode;
  extractionResult: ExtractionResult;
}

export function ValidationProvider({
  children,
  extractionResult,
}: ValidationProviderProps) {
  const [state, dispatch] = useReducer(
    validationReducer,
    extractionResult,
    initializeState,
  );

  return (
    <ValidationContext.Provider value={{ state, dispatch }}>
      {children}
    </ValidationContext.Provider>
  );
}
