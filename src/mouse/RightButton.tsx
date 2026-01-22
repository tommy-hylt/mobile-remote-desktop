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
        })
          .then((res) => {
            if (!res.ok)
              console.error('RightDown failed:', res.status, res.statusText);
          })
          .catch((e) => console.error(e));
      }}
      onPointerUp={(e) => {
        e.stopPropagation();
        fetch('/mouse/right/up', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: '{}',
        })
          .then((res) => {
            if (!res.ok)
              console.error('RightUp failed:', res.status, res.statusText);
          })
          .catch((e) => console.error(e));
      }}
    ></div>
  );
};
