import { useRef } from 'react';
import { useDraggable } from '../screen/useDraggable';
import './LeftButton.css';
import { useSocket } from '../useSocket';

interface LeftButtonProps {
  x: number;
  y: number;
  onDrag: (dx: number, dy: number) => void;
}

export const LeftButton = ({ x, y, onDrag }: LeftButtonProps) => {
  const { sendCommand } = useSocket();
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
        timerRef.current = window.setTimeout(() => {
          hasFiredDownRef.current = true;
          sendCommand('POST /mouse/left/down');
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
          sendCommand('POST /mouse/left/up');
        } else {
          sendCommand('POST /mouse/left/click');
        }
      }}
    ></div>
  );
};
