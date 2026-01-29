import { useRef } from 'react';
import { useDraggable } from '../screen/useDraggable';
import './RightButton.css';

interface RightButtonProps {
  x: number;
  y: number;
  onDrag: (dx: number, dy: number) => void;
}

export const RightButton = ({ x, y, onDrag }: RightButtonProps) => {
  const { handlers } = useDraggable(onDrag, 300);
  const timerRef = useRef<number | null>(null);
  const hasFiredDownRef = useRef(false);

  return (
    <div
      className="mouse-RightButton"
      style={{ left: x, top: y }}
      onPointerDown={(e) => {
        handlers.onPointerDown(e);
        e.stopPropagation();

        hasFiredDownRef.current = false;
        timerRef.current = setTimeout(() => {
          hasFiredDownRef.current = true;
          fetch('/mouse/right/down', {
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
          fetch('/mouse/right/up', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: '{}',
          }).catch((e) => console.error(e));
        } else {
          fetch('/mouse/right/click', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: '{}',
          }).catch((e) => console.error(e));
        }
      }}
    ></div>
  );
};
