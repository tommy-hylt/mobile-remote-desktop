import { useRef, useEffect } from 'react';

import './Cursor.css';

import type { ViewportState } from '../screen/ViewportState';

interface CursorProps {
  x: number;
  y: number;
  cursorPos: { x: number; y: number };
  viewport: ViewportState;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  setCursorPos: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
}

export const Cursor = ({
  x,
  y,
  cursorPos,
  viewport,
  setIsActive,
  setCursorPos,
}: CursorProps) => {
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const lastFetchTimeRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestPosRef = useRef(cursorPos);

  useEffect(() => {
    latestPosRef.current = cursorPos;
  }, [cursorPos]);

  const sendMove = (pos: { x: number; y: number }) => {
    fetch('/mouse/move', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ x: Math.round(pos.x), y: Math.round(pos.y) }),
    });
    lastFetchTimeRef.current = Date.now();
  };

  useEffect(() => {
    const now = Date.now();
    const timeSinceLast = now - lastFetchTimeRef.current;

    if (timeSinceLast >= 1000) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      sendMove(cursorPos);
    } else if (!timeoutRef.current) {
      const delay = 1000 - timeSinceLast;
      timeoutRef.current = setTimeout(() => {
        sendMove(latestPosRef.current);
        timeoutRef.current = null;
      }, delay);
    }
  }, [cursorPos]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      className="mouse-Cursor"
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
      onClick={(e) => {
        e.stopPropagation();
        setIsActive((prev: boolean) => !prev);
      }}
      onTouchStart={(e) => {
        e.stopPropagation();
        const t = e.touches[0];
        lastPosRef.current = { x: t.clientX, y: t.clientY };
      }}
      onTouchMove={(e) => {
        e.stopPropagation();
        if (!lastPosRef.current) return;

        const t = e.touches[0];
        const dx = t.clientX - lastPosRef.current.x;
        const dy = t.clientY - lastPosRef.current.y;
        const remoteDx = dx / viewport.scale;
        const remoteDy = dy / viewport.scale;

        setCursorPos((prev: { x: number; y: number }) => {
          const nextX = Math.max(0, prev.x + remoteDx);
          const nextY = Math.max(0, prev.y + remoteDy);
          return { x: nextX, y: nextY };
        });

        lastPosRef.current = { x: t.clientX, y: t.clientY };
      }}
      onTouchEnd={(e) => {
        e.stopPropagation();
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
          sendMove(latestPosRef.current);
        }
        lastPosRef.current = null;
      }}
    />
  );
};
