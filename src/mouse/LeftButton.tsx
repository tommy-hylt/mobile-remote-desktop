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
        fetch('/mouse/left/down', { method: 'POST' }).catch(() => {});
      }}
      onPointerUp={(e) => {
        e.stopPropagation();
        fetch('/mouse/left/up', { method: 'POST' }).catch(() => {});
      }}
    ></div>
  );
};
