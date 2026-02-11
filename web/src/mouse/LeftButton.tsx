import { useRef } from 'react';
import { useDraggable } from '../screen/useDraggable';
import './LeftButton.css';

interface LeftButtonProps {
  x: number;
  y: number;
  onDrag: (dx: number, dy: number) => void;
  sendCommand: (method: string, params?: Record<string, unknown>) => string | null;
}

export const LeftButton = ({ x, y, onDrag, sendCommand }: LeftButtonProps) => {
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
          if (!sendCommand('POST /mouse/left/down')) {
            fetch('/mouse/left/down', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: '{}',
            }).catch((e) => console.error(e));
          }
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
          if (!sendCommand('POST /mouse/left/up')) {
            fetch('/mouse/left/up', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: '{}',
            }).catch((e) => console.error(e));
          }
        } else {
          if (!sendCommand('POST /mouse/left/click')) {
            fetch('/mouse/left/click', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: '{}',
            }).catch((e) => console.error(e));
          }
        }
      }}
    ></div>
  );
};