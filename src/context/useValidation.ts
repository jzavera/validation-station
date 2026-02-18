import { useContext } from 'react';
import { ValidationContext } from './ValidationProvider';
import type { ValidationContextValue } from './ValidationProvider';

/**
 * Consume the validation context.
 * Must be used inside a <ValidationProvider>.
 */
export function useValidation(): ValidationContextValue {
  const context = useContext(ValidationContext);
  if (context === null) {
    throw new Error(
      'useValidation must be used within a ValidationProvider',
    );
  }
  return context;
}
