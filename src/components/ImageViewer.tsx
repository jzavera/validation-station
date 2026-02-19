import { forwardRef, useState, useCallback } from 'react';
import type { Field } from '../types/extraction';
import type { ValidationAction } from '../context/validationReducer';
import { BoundingBoxOverlay } from './BoundingBoxOverlay';

interface ImageViewerProps {
  sourceUrl: string;
  zoom: number;
  activeField: Field | null;
  dispatch: React.Dispatch<ValidationAction>;
}

/**
 * Renders a single image document in a scrollable container.
 * The image is wrapped in a position:relative div for overlay support.
 * Zoom is applied via CSS transform with transform-origin: top left.
 * The ref is forwarded to the scroll container for scroll-to-field (Phase 9).
 * Bounding box overlays for the active field are rendered inside the image wrapper.
 */
export const ImageViewer = forwardRef<HTMLDivElement, ImageViewerProps>(
  function ImageViewer({ sourceUrl, zoom, activeField, dispatch }, ref) {
    const [hasError, setHasError] = useState(false);

    const onError = useCallback(() => {
      setHasError(true);
    }, []);

    const handlePageClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!activeField?.isMissing) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        dispatch({ type: 'CAPTURE_MISSING', pageNumber: 1, x, y });
      },
      [activeField, dispatch],
    );

    if (hasError) {
      return (
        <div
          ref={ref}
          className="h-full w-full overflow-auto flex items-center justify-center"
        >
          <div className="text-center text-gray-500">
            <svg
              className="mx-auto mb-2 h-10 w-10 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
              />
            </svg>
            <p className="text-sm font-medium">Document not available</p>
            <p className="text-xs mt-1">
              Could not load image from {sourceUrl}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div ref={ref} className="h-full w-full overflow-auto">
        <div className="p-4">
          <div
            className={`relative inline-block shadow-md ${activeField?.isMissing ? 'cursor-crosshair' : ''}`}
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'top left',
            }}
            data-page-number={1}
            onClick={handlePageClick}
          >
            <img
              src={sourceUrl}
              alt="Source document"
              onError={onError}
              className="block max-w-none"
              draggable={false}
            />
            <BoundingBoxOverlay
              activeField={activeField}
              pageNumber={1}
            />
          </div>
        </div>
      </div>
    );
  },
);
