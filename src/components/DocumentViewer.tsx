import { useMemo, useRef } from 'react';
import { useValidation } from '../context/useValidation';
import { useDocumentScroll } from '../hooks/useDocumentScroll';
import { PdfViewer } from './PdfViewer';
import { ImageViewer } from './ImageViewer';
import type { Field } from '../types/extraction';

/**
 * Dispatches to the correct document renderer (PDF or image) based on
 * the document.type field in the extraction result. Reads zoom from state.
 *
 * Derives the active field from state and passes it to viewers for
 * bounding box overlay rendering (Phase 8).
 *
 * Maintains a ref to the scroll container for scroll-to-field (Phase 9).
 * The useDocumentScroll hook scrolls to the active field's bounding box
 * region whenever the active field changes.
 */
export function DocumentViewer() {
  const { state, dispatch } = useValidation();
  const scrollRef = useRef<HTMLDivElement>(null);

  const { type, sourceUrl } = state.result.document;
  const { zoom } = state;

  // Derive the active field object from the active field ID
  const activeField: Field | null = useMemo(() => {
    if (!state.activeFieldId) return null;
    for (const group of state.result.fieldGroups) {
      for (const field of group.fields) {
        if (field.id === state.activeFieldId) return field;
      }
    }
    return null;
  }, [state.activeFieldId, state.result.fieldGroups]);

  // Scroll document to the active field's bounding box region (Phase 9)
  useDocumentScroll(scrollRef, activeField, zoom);

  if (type === 'pdf') {
    return (
      <PdfViewer
        ref={scrollRef}
        sourceUrl={sourceUrl}
        zoom={zoom}
        activeField={activeField}
        dispatch={dispatch}
      />
    );
  }

  return (
    <ImageViewer
      ref={scrollRef}
      sourceUrl={sourceUrl}
      zoom={zoom}
      activeField={activeField}
      dispatch={dispatch}
    />
  );
}
