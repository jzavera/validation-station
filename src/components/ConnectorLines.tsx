import { useEffect, useRef, useMemo } from 'react';
import { useValidation } from '../context/useValidation';

/**
 * Snappy elastic easing — overshoots then settles.
 * At t=0 → 0, t≈0.3 → ~1.07 (overshoot), t=1 → 1
 */
function elasticOut(t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1;
}

interface Point {
  x: number;
  y: number;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Single dark-blue connector line from the active field's bounding box
 * on the document to the field row in the right panel.
 *
 * - Elastic snap animation (100ms) when switching between fields
 * - Smoothly follows scroll/zoom without elastic
 * - Hidden when no field is active or active field is missing
 */
export function ConnectorLines() {
  const { state } = useValidation();
  const svgRef = useRef<SVGSVGElement>(null);
  const lineRef = useRef<SVGLineElement>(null);

  const activeField = useMemo(() => {
    if (!state.activeFieldId) return null;
    for (const group of state.result.fieldGroups) {
      for (const field of group.fields) {
        if (field.id === state.activeFieldId) return field;
      }
    }
    return null;
  }, [state.activeFieldId, state.result.fieldGroups]);

  const shouldShow = activeField != null && !activeField.isMissing &&
    activeField.boundingBox.width > 0;

  // Animation refs — no React re-renders during animation
  const fromStart = useRef<Point>({ x: 0, y: 0 });
  const fromEnd = useRef<Point>({ x: 0, y: 0 });
  const currentStart = useRef<Point>({ x: 0, y: 0 });
  const currentEnd = useRef<Point>({ x: 0, y: 0 });
  const animStartTime = useRef<number | null>(null);
  const prevFieldId = useRef<string | null>(null);
  const wasVisible = useRef(false);

  useEffect(() => {
    const svg = svgRef.current;
    if (!shouldShow || !svg) {
      if (svg) svg.style.display = 'none';
      wasVisible.current = false;
      prevFieldId.current = state.activeFieldId;
      return;
    }

    let rafId: number;
    const DURATION = 100;

    const update = (timestamp: number) => {
      const line = lineRef.current;
      if (!svg || !line) {
        rafId = requestAnimationFrame(update);
        return;
      }

      // Find DOM elements
      const fieldEl = document.querySelector('[data-field-active]');
      const bboxEls = document.querySelectorAll('[data-bbox-highlight]');

      if (!fieldEl || bboxEls.length === 0) {
        svg.style.display = 'none';
        rafId = requestAnimationFrame(update);
        return;
      }

      // Combined bounding rect of all highlight boxes
      let minTop = Infinity;
      let maxBottom = -Infinity;
      let maxRight = -Infinity;

      bboxEls.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;
        minTop = Math.min(minTop, r.top);
        maxBottom = Math.max(maxBottom, r.bottom);
        maxRight = Math.max(maxRight, r.right);
      });

      if (minTop === Infinity) {
        svg.style.display = 'none';
        rafId = requestAnimationFrame(update);
        return;
      }

      const fieldRect = fieldEl.getBoundingClientRect();

      // Target endpoints: bbox right-center → field row left-center
      const targetStart: Point = { x: maxRight, y: (minTop + maxBottom) / 2 };
      const targetEnd: Point = { x: fieldRect.left, y: (fieldRect.top + fieldRect.bottom) / 2 };

      // Did the field change? Trigger elastic animation
      if (state.activeFieldId !== prevFieldId.current) {
        fromStart.current = wasVisible.current
          ? { ...currentStart.current }
          : { ...targetStart };
        fromEnd.current = wasVisible.current
          ? { ...currentEnd.current }
          : { ...targetEnd };
        animStartTime.current = timestamp;
        prevFieldId.current = state.activeFieldId;
      }

      // Animate or follow
      if (animStartTime.current !== null) {
        const elapsed = timestamp - animStartTime.current;
        const t = Math.min(elapsed / DURATION, 1);
        const eased = elasticOut(t);

        currentStart.current = {
          x: lerp(fromStart.current.x, targetStart.x, eased),
          y: lerp(fromStart.current.y, targetStart.y, eased),
        };
        currentEnd.current = {
          x: lerp(fromEnd.current.x, targetEnd.x, eased),
          y: lerp(fromEnd.current.y, targetEnd.y, eased),
        };

        if (t >= 1) animStartTime.current = null;
      } else {
        // No animation — just follow (scroll/zoom tracking)
        currentStart.current = targetStart;
        currentEnd.current = targetEnd;
      }

      svg.style.display = '';
      wasVisible.current = true;

      line.setAttribute('x1', String(currentStart.current.x));
      line.setAttribute('y1', String(currentStart.current.y));
      line.setAttribute('x2', String(currentEnd.current.x));
      line.setAttribute('y2', String(currentEnd.current.y));

      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [shouldShow, state.activeFieldId]);

  return (
    <svg
      ref={svgRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 40, display: 'none' }}
    >
      <line
        ref={lineRef}
        stroke="#1e3a8a"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
}
