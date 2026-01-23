import { useDraggable } from '../screen/useDraggable';
import './LeftButton.css';

interface LeftButtonProps {
  x: number;
  y: number;
  onDrag: (dx: number, dy: number) => void;
}

export const LeftButton = ({ x, y, onDrag }: LeftButtonProps) => {
  const { handlers } = useDraggable(onDrag);

  return (
    <div
      className="mouse-LeftButton"
      style={{ left: x, top: y }}
      onPointerDown={(e) => {
        handlers.onPointerDown(e);
        e.stopPropagation();
        fetch('/mouse/left/down', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: '{}',
        }).catch((e) => console.error(e));
      }}
      onPointerMove={handlers.onPointerMove}
      onPointerUp={(e) => {
        handlers.onPointerUp(e);
        e.stopPropagation();
        fetch('/mouse/left/up', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: '{}',
        }).catch((e) => console.error(e));
      }}
    ></div>
  );
};
