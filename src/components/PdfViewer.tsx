import { forwardRef, useState, useCallback } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import type { Field } from '../types/extraction';
import type { ValidationAction } from '../context/validationReducer';
import { BoundingBoxOverlay } from './BoundingBoxOverlay';

interface PdfViewerProps {
  sourceUrl: string;
  zoom: number;
  activeField: Field | null;
  dispatch: React.Dispatch<ValidationAction>;
}

/**
 * Renders a multi-page PDF document in a scrollable container.
 * Each page is wrapped in a position:relative div for overlay support.
 * The ref is forwarded to the scroll container for scroll-to-field (Phase 9).
 * Bounding box overlays for the active field are rendered inside each page wrapper.
 */
export const PdfViewer = forwardRef<HTMLDivElement, PdfViewerProps>(
  function PdfViewer({ sourceUrl, zoom, activeField, dispatch }, ref) {
    const [numPages, setNumPages] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    const onDocumentLoadSuccess = useCallback(
      ({ numPages: total }: { numPages: number }) => {
        setNumPages(total);
        setError(null);
      },
      [],
    );

    const onDocumentLoadError = useCallback(() => {
      setError('Failed to load PDF document');
    }, []);

    // Whether the active field needs a value (missing or empty)
    const needsCapture = activeField != null &&
      (activeField.isMissing || activeField.extractedValue === '');

    const handlePageClick = useCallback(
      (pageNumber: number, e: React.MouseEvent<HTMLDivElement>) => {
        if (!activeField) return;
        const fieldNeedsValue = activeField.isMissing || activeField.extractedValue === '';
        if (!fieldNeedsValue) return;

        // Check if user clicked on a text layer span
        const target = e.target as HTMLElement;
        if (target instanceof HTMLSpanElement && target.closest('.textLayer')) {
          const text = (target.textContent || '').trim();
          if (!text) return;

          // Calculate normalized bounding box from the span's position
          const pageWrapper = e.currentTarget;
          const pageRect = pageWrapper.getBoundingClientRect();
          const spanRect = target.getBoundingClientRect();

          const bbox = {
            pageNumber,
            x: (spanRect.left - pageRect.left) / pageRect.width,
            y: (spanRect.top - pageRect.top) / pageRect.height,
            width: spanRect.width / pageRect.width,
            height: spanRect.height / pageRect.height,
          };

          dispatch({ type: 'CAPTURE_VALUE', value: text, boundingBox: bbox });
          return;
        }

        // Fallback: clicked on empty space — set bounding box at click position and enter edit mode
        if (activeField.isMissing) {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width;
          const y = (e.clientY - rect.top) / rect.height;
          dispatch({ type: 'CAPTURE_MISSING', pageNumber, x, y });
        }
      },
      [activeField, dispatch],
    );

    if (error) {
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
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
            <p className="text-sm font-medium">Document not available</p>
            <p className="text-xs mt-1">{error}</p>
          </div>
        </div>
      );
    }

    return (
      <div ref={ref} className="h-full w-full overflow-auto">
        <Document
          file={sourceUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div className="flex items-center justify-center h-full w-full py-20">
              <p className="text-sm text-gray-500">Loading PDF...</p>
            </div>
          }
        >
          <div className="flex flex-col items-center gap-2 p-4">
            {Array.from({ length: numPages }, (_, index) => (
              <div
                key={`page-${index + 1}`}
                className={`relative shadow-md ${needsCapture ? 'capture-mode' : ''}`}
                data-page-number={index + 1}
                onClick={(e) => handlePageClick(index + 1, e)}
              >
                <Page
                  pageNumber={index + 1}
                  scale={zoom}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                />
                <BoundingBoxOverlay
                  activeField={activeField}
                  pageNumber={index + 1}
                />
              </div>
            ))}
          </div>
        </Document>
      </div>
    );
  },
);
