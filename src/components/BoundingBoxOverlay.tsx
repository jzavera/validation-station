import type { Field, BoundingBox } from '../types/extraction';

interface BoundingBoxOverlayProps {
  activeField: Field | null;
  pageNumber: number;
}

/**
 * Renders colored highlight overlays for the active field's extraction region.
 *
 * - If the field has tokens, token-level bounding boxes are used (BBOX-01).
 * - Otherwise the field-level boundingBox is used as fallback (BBOX-02).
 * - Coordinates are normalized 0-1 and positioned via percentage CSS (BBOX-03).
 * - pointer-events-none ensures overlays don't interfere with interaction.
 * - Only renders overlays for the active field (BBOX-05).
 *
 * Must be placed inside a position:relative container that matches the document
 * page dimensions. Overlays stay aligned during zoom because they use percentages
 * relative to the parent (BBOX-04).
 */
export function BoundingBoxOverlay({ activeField, pageNumber }: BoundingBoxOverlayProps) {
  if (!activeField) return null;

  // Determine which boxes to render: token-level or field-level fallback
  const boxes: BoundingBox[] =
    activeField.tokens.length > 0
      ? activeField.tokens.map((t) => t.boundingBox)
      : [activeField.boundingBox];

  // Filter to only boxes on this page
  const pageBoxes = boxes.filter((box) => box.pageNumber === pageNumber);

  if (pageBoxes.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {pageBoxes.map((box, index) => (
        <div
          key={index}
          data-bbox-highlight
          className="absolute border-2 border-blue-500 bg-blue-500/20 rounded-sm pointer-events-none"
          style={{
            left: `${box.x * 100}%`,
            top: `${box.y * 100}%`,
            width: `${box.width * 100}%`,
            height: `${box.height * 100}%`,
          }}
        />
      ))}
    </div>
  );
}
