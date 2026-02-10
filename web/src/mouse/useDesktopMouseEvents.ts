import { useEffect } from 'react';
import type { ViewportState } from '../screen/ViewportState';
import type { ScreenSize } from '../screen/ScreenSize';

export const useDesktopMouseEvents = (
  viewport: ViewportState,
  screenSize: ScreenSize,
  setCursorPos: (pos: { x: number; y: number }) => void
) => {
  useEffect(() => {
    let isMiddleDown = false;
    let lastPos = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      const rx = Math.max(0, Math.min(screenSize.width, (e.clientX - viewport.u) / viewport.scale));
      const ry = Math.max(0, Math.min(screenSize.height, (e.clientY - viewport.v) / viewport.scale));
      
      if (isMiddleDown) {
        const dx = e.clientX - lastPos.x;
        const dy = e.clientY - lastPos.y;
        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
          fetch('/mouse/scroll', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ x: Math.round(dx * -2), y: Math.round(dy * -2) }),
          }).catch((err) => console.error(err));
          lastPos = { x: e.clientX, y: e.clientY };
        }
      } else {
        setCursorPos({ x: rx, y: ry });
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 1) { // Middle button
        isMiddleDown = true;
        lastPos = { x: e.clientX, y: e.clientY };
        return;
      }
      const buttons = ['left', 'middle', 'right'];
      const button = buttons[e.button];
      if (button) {
        fetch(`/mouse/${button}/down`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: '{}',
        }).catch((err) => console.error(err));
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
        fetch(`/mouse/${button}/up`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: '{}',
        }).catch((err) => console.error(err));
      }
    };

    const handleWheel = (e: WheelEvent) => {
      fetch('/mouse/scroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          x: Math.round(e.deltaX * -0.5), 
          y: Math.round(e.deltaY * -0.5) 
        }),
      }).catch((err) => console.error(err));
    };

    const handleContextMenu = (e: MouseEvent) => e.preventDefault();

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('wheel', handleWheel);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [viewport, screenSize, setCursorPos]);
};
