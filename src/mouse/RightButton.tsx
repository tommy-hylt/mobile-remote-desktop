import { useDraggable } from '../screen/useDraggable';
import './RightButton.css';

interface RightButtonProps {
  x: number;
  y: number;
  onDrag: (dx: number, dy: number) => void;
}

export const RightButton = ({ x, y, onDrag }: RightButtonProps) => {
  const { handlers } = useDraggable(onDrag);

  return (
    <div
      className="mouse-RightButton"
      style={{ left: x, top: y }}
      onPointerDown={(e) => {
        handlers.onPointerDown(e);
        e.stopPropagation();
        fetch('/mouse/right/down', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: '{}',
        }).catch((e) => console.error(e));
      }}
      onPointerMove={handlers.onPointerMove}
      onPointerUp={(e) => {
        handlers.onPointerUp(e);
        e.stopPropagation();
        fetch('/mouse/right/up', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: '{}',
        }).catch((e) => console.error(e));
      }}
    ></div>
  );
};
