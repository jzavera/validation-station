import { forwardRef, useState, useCallback } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

interface PdfViewerProps {
  sourceUrl: string;
  zoom: number;
}

/**
 * Renders a multi-page PDF document in a scrollable container.
 * Each page is wrapped in a position:relative div for future overlay support.
 * The ref is forwarded to the scroll container for scroll-to-field (Phase 9).
 */
export const PdfViewer = forwardRef<HTMLDivElement, PdfViewerProps>(
  function PdfViewer({ sourceUrl, zoom }, ref) {
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
                className="relative shadow-md"
                data-page-number={index + 1}
              >
                <Page
                  pageNumber={index + 1}
                  scale={zoom}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                />
              </div>
            ))}
          </div>
        </Document>
      </div>
    );
  },
);
