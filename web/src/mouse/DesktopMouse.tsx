import './DesktopMouse.css';
import type { ViewportState } from '../screen/ViewportState';

interface DesktopMouseProps {
  cursorPos: { x: number; y: number };
  viewport: ViewportState;
}

export const DesktopMouse = ({ cursorPos, viewport }: DesktopMouseProps) => {
  const x = cursorPos.x * viewport.scale + viewport.u;
  const y = cursorPos.y * viewport.scale + viewport.v;

  return (
    <div
      className="mouse-DesktopMouse"
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
    />
  );
};
