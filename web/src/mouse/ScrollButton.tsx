import { useRef } from 'react';
import { useDraggable } from '../screen/useDraggable';
import './ScrollButton.css';

interface ScrollButtonProps {
  x: number;
  y: number;
  onDrag: (dx: number, dy: number) => void;
  sendCommand: (method: string, params?: Record<string, unknown>) => boolean;
}

export const ScrollButton = ({ x, y, onDrag, sendCommand }: ScrollButtonProps) => {
  const { handlers } = useDraggable(onDrag, 1000);
  const scrollStartRef = useRef<{ x: number; y: number } | null>(null);

  return (
    <div
      className="mouse-ScrollButton"
      style={{ left: `${x}px`, top: `${y}px` }}
      onPointerDown={(e) => {
        handlers.onPointerDown(e);
        e.stopPropagation();
        scrollStartRef.current = { x: e.clientX, y: e.clientY };
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        handlers.onPointerMove(e);
        e.stopPropagation();
        if (scrollStartRef.current === null) return;

        const dx = e.clientX - scrollStartRef.current.x;
        const dy = e.clientY - scrollStartRef.current.y;

        if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
          const params = {
            x: Math.round(dx * -2),
            y: Math.round(dy * -2),
          };
          if (!sendCommand('POST /mouse/scroll', params)) {
            fetch('/mouse/scroll', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(params),
            }).catch((e) => console.error(e));
          }
          scrollStartRef.current = { x: e.clientX, y: e.clientY };
        }
      }}
      onPointerUp={(e) => {
        handlers.onPointerUp(e);
        e.stopPropagation();
        scrollStartRef.current = null;
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      }}
      onPointerCancel={(e) => {
        handlers.onPointerCancel(e);
        scrollStartRef.current = null;
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      }}
    />
  );
};