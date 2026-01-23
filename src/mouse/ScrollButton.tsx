import { useRef } from 'react';
import { useDraggable } from '../screen/useDraggable';
import './ScrollButton.css';

interface ScrollButtonProps {
  x: number;
  y: number;
  onDrag: (dx: number, dy: number) => void;
}

export const ScrollButton = ({ x, y, onDrag }: ScrollButtonProps) => {
  const { handlers } = useDraggable(onDrag);
  const scrollStartRef = useRef<number | null>(null);

  return (
    <div
      className="mouse-ScrollButton"
      style={{ left: `${x}px`, top: `${y}px` }}
      onPointerDown={(e) => {
        handlers.onPointerDown(e);
        e.stopPropagation();
        scrollStartRef.current = e.clientY;
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        handlers.onPointerMove(e);
        e.stopPropagation();
        if (scrollStartRef.current === null) return;

        const dy = e.clientY - scrollStartRef.current;

        if (Math.abs(dy) > 10) {
          fetch('/mouse/scroll', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ x: 0, y: Math.round(dy * -2) }),
          }).catch((e) => console.error(e));
          scrollStartRef.current = e.clientY;
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
