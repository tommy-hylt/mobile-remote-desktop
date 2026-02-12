import { useRef } from 'react';
import './Cursor.css';
import type { ViewportState } from '../screen/ViewportState';
import { useMoveSender } from './useMoveSender';

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

  useMoveSender(cursorPos);

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
      onPointerDown={(e) => {
        e.stopPropagation();
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        lastPosRef.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerMove={(e) => {
        e.stopPropagation();
        if (!lastPosRef.current) return;

        const dx = e.clientX - lastPosRef.current.x;
        const dy = e.clientY - lastPosRef.current.y;
        const remoteDx = dx / viewport.scale;
        const remoteDy = dy / viewport.scale;

        setCursorPos((prev: { x: number; y: number }) => {
          const nextX = Math.max(0, prev.x + remoteDx);
          const nextY = Math.max(0, prev.y + remoteDy);
          return { x: nextX, y: nextY };
        });

        lastPosRef.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={(e) => {
        e.stopPropagation();
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        lastPosRef.current = null;
      }}
      onPointerCancel={(e) => {
        e.stopPropagation();
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        lastPosRef.current = null;
      }}
    />
  );
};
