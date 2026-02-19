import { useEffect } from 'react';
import type { RefObject } from 'react';
import type { Field } from '../types/extraction';

/**
 * Scrolls the document viewer to center the active field's bounding box
 * region whenever the active field changes.
 *
 * - Finds the page element via `[data-page-number]` selector (SYNC-02).
 * - Calculates the Y offset using normalized bbox coordinates and page height.
 * - Uses `scrollTo({ behavior: 'smooth' })` for animated scrolling (SYNC-03).
 *
 * Works for both multi-page PDFs (different pages) and single-page images.
 */
export function useDocumentScroll(
  scrollContainerRef: RefObject<HTMLDivElement | null>,
  activeField: Field | null,
  zoom: number,
) {
  useEffect(() => {
    if (!activeField || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const { boundingBox } = activeField;

    // Find the page element that contains this field's bounding box
    const pageElement = container.querySelector<HTMLElement>(
      `[data-page-number="${boundingBox.pageNumber}"]`,
    );

    if (!pageElement) return;

    // Calculate the target Y position within the scroll container.
    // pageElement.offsetTop gives the page's position relative to its
    // offset parent. We add the bbox Y offset scaled by the page's
    // rendered height to get the absolute position of the field.
    const fieldYInPage = boundingBox.y * pageElement.clientHeight;
    const targetY = pageElement.offsetTop + fieldYInPage;

    // Center the field in the visible viewport area
    const containerHeight = container.clientHeight;
    const scrollTarget = targetY - containerHeight / 2;

    container.scrollTo({
      top: Math.max(0, scrollTarget),
      behavior: 'smooth',
    });
  }, [activeField, scrollContainerRef, zoom]);
}
