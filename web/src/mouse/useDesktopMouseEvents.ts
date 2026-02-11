import { useEffect } from 'react';
import type { ViewportState } from '../screen/ViewportState';
import type { ScreenSize } from '../screen/ScreenSize';

export const useDesktopMouseEvents = (
  containerRef: React.RefObject<HTMLDivElement | null>,
  viewport: ViewportState,
  screenSize: ScreenSize,
  setCursorPos: (pos: { x: number; y: number }) => void,
  sendCommand: (method: string, params?: Record<string, unknown>) => string | null
) => {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isMiddleDown = false;
    let lastPos = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      const rx = Math.max(0, Math.min(screenSize.width, (e.clientX - viewport.u) / viewport.scale));
      const ry = Math.max(0, Math.min(screenSize.height, (e.clientY - viewport.v) / viewport.scale));

      if (isMiddleDown) {
        const dx = e.clientX - lastPos.x;
        const dy = e.clientY - lastPos.y;
        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
          sendCommand('POST /mouse/scroll', { x: Math.round(dx * -2), y: Math.round(dy * -2) });
          lastPos = { x: e.clientX, y: e.clientY };
        }
      } else {
        setCursorPos({ x: rx, y: ry });
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 1) {
        isMiddleDown = true;
        lastPos = { x: e.clientX, y: e.clientY };
        return;
      }
      const buttons = ['left', 'middle', 'right'];
      const button = buttons[e.button];
      if (button) {
        sendCommand(`POST /mouse/${button}/down`);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 1) {
        isMiddleDown = false;
        return;
      }
      const buttons = ['left', 'middle', 'right'];
      const button = buttons[e.button];
      if (button) {
        sendCommand(`POST /mouse/${button}/up`);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      sendCommand('POST /mouse/scroll', {
        x: Math.round(e.deltaX * -0.5),
        y: Math.round(e.deltaY * -0.5),
      });
    };

    const handleContextMenu = (e: MouseEvent) => e.preventDefault();

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('contextmenu', handleContextMenu);
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('contextmenu', handleContextMenu);
      container.removeEventListener('wheel', handleWheel);
    };
  }, [containerRef, viewport, screenSize, setCursorPos, sendCommand]);
};
