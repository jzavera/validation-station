/**
 * Confidence-level helpers.
 *
 * Thresholds:
 *   < 0.7  -> Low  (red)
 *   0.7-0.9 -> Medium (yellow)
 *   >= 0.9 -> High (green)
 */

/**
 * Return the Tailwind **background** color class for a confidence value.
 */
export function getConfidenceColor(confidence: number): string {
  if (confidence >= 0.9) return 'bg-green-500';
  if (confidence >= 0.7) return 'bg-yellow-500';
  return 'bg-red-500';
}

/**
 * Return a human-readable label for a confidence value.
 */
export function getConfidenceLabel(confidence: number): string {
  if (confidence >= 0.9) return 'High';
  if (confidence >= 0.7) return 'Medium';
  return 'Low';
}
