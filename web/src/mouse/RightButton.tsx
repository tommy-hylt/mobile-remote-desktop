import { useRef } from 'react';
import { useDraggable } from '../screen/useDraggable';
import './RightButton.css';

interface RightButtonProps {
  x: number;
  y: number;
  onDrag: (dx: number, dy: number) => void;
  sendCommand: (method: string, params?: Record<string, unknown>) => string | null;
}

export const RightButton = ({ x, y, onDrag, sendCommand }: RightButtonProps) => {
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
        timerRef.current = window.setTimeout(() => {
          hasFiredDownRef.current = true;
          sendCommand('POST /mouse/right/down');
        }, 500);
      }}
      onPointerMove={handlers.onPointerMove}
      onPointerUp={(e) => {
        handlers.onPointerUp(e);
        e.stopPropagation();

        if (timerRef.current) {
          window.clearTimeout(timerRef.current);
          timerRef.current = null;
        }

        if (hasFiredDownRef.current) {
          sendCommand('POST /mouse/right/up');
        } else {
          sendCommand('POST /mouse/right/click');
        }
      }}
    ></div>
  );
};
