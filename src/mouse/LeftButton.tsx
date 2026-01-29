import { useRef } from 'react';
import { useDraggable } from '../screen/useDraggable';
import './LeftButton.css';

interface LeftButtonProps {
  x: number;
  y: number;
  onDrag: (dx: number, dy: number) => void;
}

export const LeftButton = ({ x, y, onDrag }: LeftButtonProps) => {
  const { handlers } = useDraggable(onDrag, 300);
  const timerRef = useRef<number | null>(null);
  const hasFiredDownRef = useRef(false);

  return (
    <div
      className="mouse-LeftButton"
      style={{ left: x, top: y }}
      onPointerDown={(e) => {
        handlers.onPointerDown(e);
        e.stopPropagation();

        hasFiredDownRef.current = false;
        timerRef.current = setTimeout(() => {
          hasFiredDownRef.current = true;
          fetch('/mouse/left/down', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: '{}',
          }).catch((e) => console.error(e));
        }, 500);
      }}
      onPointerMove={handlers.onPointerMove}
      onPointerUp={(e) => {
        handlers.onPointerUp(e);
        e.stopPropagation();

        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }

        if (hasFiredDownRef.current) {
          fetch('/mouse/left/up', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: '{}',
          }).catch((e) => console.error(e));
        } else {
          fetch('/mouse/left/click', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: '{}',
          }).catch((e) => console.error(e));
        }
      }}
    ></div>
  );
};
