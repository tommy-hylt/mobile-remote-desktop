import { useRef } from 'react';

export const useDraggable = (
  onDrag: (dx: number, dy: number) => void,
  threshold: number,
) => {
  const isDragging = useRef(false);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const timerRef = useRef<number | null>(null);
  const canDragRef = useRef(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = false;
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    canDragRef.current = false;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      canDragRef.current = true;
    }, threshold);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragStartPos.current) {
      const dx = e.clientX - dragStartPos.current.x;
      const dy = e.clientY - dragStartPos.current.y;

      if (!canDragRef.current) {
        if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
          if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
          }
        }
        return;
      }

      if (Math.abs(dx) > 0 || Math.abs(dy) > 0) {
        isDragging.current = true;
        onDrag(dx, dy);
        dragStartPos.current = { x: e.clientX, y: e.clientY };
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    dragStartPos.current = null;
    isDragging.current = false;
    canDragRef.current = false;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  return {
    isDragging,
    handlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerUp,
    },
  };
};
