import './LeftButton.css';

interface LeftButtonProps {
  x: number;
  y: number;
}

export const LeftButton = ({ x, y }: LeftButtonProps) => {
  return (
    <div
      className="mouse-LeftButton"
      style={{ left: x, top: y }}
      onPointerDown={(e) => {
        e.stopPropagation();
        fetch('/mouse/left/down', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: '{}',
        })
          .then(async (res) => {
            const text = await res.text();
            console.log('LeftDown auth:', res.status, text);
          })
          .catch((e) => console.error(e));
      }}
      onPointerUp={(e) => {
        e.stopPropagation();
        fetch('/mouse/left/up', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: '{}',
        })
          .then(async (res) => {
            const text = await res.text();
            console.log('LeftUp auth:', res.status, text);
          })
          .catch((e) => console.error(e));
      }}
    ></div>
  );
};
