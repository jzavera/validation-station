import { getConfidenceColor, getConfidenceLabel } from '../utils/confidence';

interface ConfidenceBadgeProps {
  confidence: number;
  operatorConfirmed: boolean;
  isMissing: boolean;
  hasEmptyValue?: boolean;
}

/**
 * Visual indicator for a field's extraction quality.
 *
 * - Confirmed field  -> green checkmark
 * - Missing field    -> gray dash
 * - Otherwise        -> colored dot (red / yellow / green)
 */
export function ConfidenceBadge({
  confidence,
  operatorConfirmed,
  isMissing,
  hasEmptyValue,
}: ConfidenceBadgeProps) {
  // Confirmed: green checkmark
  if (operatorConfirmed) {
    return (
      <span
        className="flex items-center justify-center w-5 h-5 shrink-0"
        aria-label="Confirmed"
      >
        <svg
          className="w-4 h-4 text-green-600"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    );
  }

  // Empty value: red dot (field was cleared)
  if (hasEmptyValue && !isMissing) {
    return (
      <span
        className="flex items-center justify-center w-5 h-5 shrink-0"
        aria-label="Confidence: Empty"
      >
        <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500" />
      </span>
    );
  }

  // Missing: gray dash
  if (isMissing) {
    return (
      <span
        className="flex items-center justify-center w-5 h-5 shrink-0"
        aria-label="Missing"
      >
        <svg
          className="w-4 h-4 text-gray-400"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    );
  }

  // Normal: colored confidence dot
  const colorClass = getConfidenceColor(confidence);
  const label = getConfidenceLabel(confidence);

  return (
    <span
      className="flex items-center justify-center w-5 h-5 shrink-0"
      aria-label={`Confidence: ${label}`}
    >
      <span
        className={`inline-block w-2.5 h-2.5 rounded-full ${colorClass}`}
      />
    </span>
  );
}
