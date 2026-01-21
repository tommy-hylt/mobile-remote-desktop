import { useRef, useEffect } from 'react';
import type { ViewportState } from './ViewportState';

export const useDragPan = (
  containerRef: React.RefObject<HTMLDivElement | null>,
  viewport: ViewportState,
  onViewportChange: (viewport: ViewportState) => void,
) => {
  const lastTouchRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const t = e.touches[0];
        lastTouchRef.current = { x: t.clientX, y: t.clientY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && lastTouchRef.current) {
        e.preventDefault();
        const t = e.touches[0];
        const prev = lastTouchRef.current;

        const dx = t.clientX - prev.x;
        const dy = t.clientY - prev.y;

        onViewportChange({
          ...viewport,
          u: viewport.u + dx,
          v: viewport.v + dy,
        });

        lastTouchRef.current = { x: t.clientX, y: t.clientY };
      }
    };

    const handleTouchEnd = () => {
      lastTouchRef.current = null;
    };

    el.addEventListener('touchstart', handleTouchStart, { passive: false });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd);

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [viewport, onViewportChange, containerRef]);
};
