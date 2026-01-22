import './RightButton.css';

interface RightButtonProps {
  x: number;
  y: number;
}

export const RightButton = ({ x, y }: RightButtonProps) => {
  return (
    <div
      className="mouse-RightButton"
      style={{ left: x, top: y }}
      onPointerDown={(e) => {
        e.stopPropagation();
        fetch('/mouse/right/down', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: '{}',
        }).catch((e) => console.error(e));
      }}
      onPointerUp={(e) => {
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
