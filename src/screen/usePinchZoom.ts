import { useRef, useEffect } from 'react';
import type { ViewportState } from './ViewportState';

export const usePinchZoom = (
  containerRef: React.RefObject<HTMLDivElement | null>,
  viewport: ViewportState,
  setViewport: (viewport: ViewportState) => void,
) => {
  const lastTouchRef = useRef<{ d: number; x: number; y: number } | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const d = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
        const x = (t1.clientX + t2.clientX) / 2;
        const y = (t1.clientY + t2.clientY) / 2;
        lastTouchRef.current = { d, x, y };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && lastTouchRef.current) {
        e.preventDefault();
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const d = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
        const x = (t1.clientX + t2.clientX) / 2;
        const y = (t1.clientY + t2.clientY) / 2;

        const prev = lastTouchRef.current;
        const factor = d / prev.d;

        const newScale = viewport.scale * factor;
        const uAfterScale = x - (x - viewport.u) * factor;
        const vAfterScale = y - (y - viewport.v) * factor;

        const newU = uAfterScale + (x - prev.x);
        const newV = vAfterScale + (y - prev.y);

        setViewport({
          u: newU,
          v: newV,
          scale: newScale,
        });

        lastTouchRef.current = { d, x, y };
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        lastTouchRef.current = null;
      }
    };

    el.addEventListener('touchstart', handleTouchStart, { passive: false });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd);

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [viewport, setViewport, containerRef]);
};
