import { useRef } from 'react';
import { useValidation } from '../context/useValidation';
import { PdfViewer } from './PdfViewer';
import { ImageViewer } from './ImageViewer';

/**
 * Dispatches to the correct document renderer (PDF or image) based on
 * the document.type field in the extraction result. Reads zoom from state.
 *
 * Maintains a ref to the scroll container for Phase 9 scroll-to-field.
 */
export function DocumentViewer() {
  const { state } = useValidation();
  const scrollRef = useRef<HTMLDivElement>(null);

  const { type, sourceUrl } = state.result.document;
  const { zoom } = state;

  if (type === 'pdf') {
    return <PdfViewer ref={scrollRef} sourceUrl={sourceUrl} zoom={zoom} />;
  }

  return <ImageViewer ref={scrollRef} sourceUrl={sourceUrl} zoom={zoom} />;
}
