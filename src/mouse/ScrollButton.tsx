import { useRef } from 'react';
import './ScrollButton.css';

interface ScrollButtonProps {
  x: number;
  y: number;
}

export const ScrollButton = ({ x, y }: ScrollButtonProps) => {
  const scrollStartRef = useRef<number | null>(null);

  return (
    <div
      className="mouse-ScrollButton"
      style={{ left: `${x}px`, top: `${y}px` }}
      onTouchStart={(e) => {
        e.stopPropagation();
        const t = e.touches[0];
        scrollStartRef.current = t.clientY;
      }}
      onTouchMove={(e) => {
        e.stopPropagation();
        if (scrollStartRef.current === null) return;
        const t = e.touches[0];
        const dy = t.clientY - scrollStartRef.current;

        if (Math.abs(dy) > 10) {
          fetch('/mouse/scroll', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ x: 0, y: Math.round(dy * -2) }),
          }).catch((e) => console.error(e));
          scrollStartRef.current = t.clientY;
        }
      }}
      onTouchEnd={(e) => {
        e.stopPropagation();
        scrollStartRef.current = null;
      }}
    />
  );
};
