import { useState } from 'react';
import './DesktopMouse.css';
import type { ViewportState } from '../screen/ViewportState';
import type { ScreenSize } from '../screen/ScreenSize';
import { useMoveFetch } from './useMoveFetch';
import { useDesktopMouseEvents } from './useDesktopMouseEvents';

interface DesktopMouseProps {
  viewport: ViewportState;
  screenSize: ScreenSize;
  sendCommand: (method: string, params?: Record<string, unknown>) => boolean;
}

export const DesktopMouse = ({ viewport, screenSize, sendCommand }: DesktopMouseProps) => {
  const [cursorPos, setCursorPos] = useState({ x: 960, y: 540 });

  useMoveFetch(cursorPos, sendCommand);
  useDesktopMouseEvents(viewport, screenSize, setCursorPos, sendCommand);

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