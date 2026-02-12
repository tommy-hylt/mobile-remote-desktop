import { useRef, useEffect, useCallback } from 'react';
import { useSocket } from '../useSocket';

export const useMoveSender = (
  cursorPos: { x: number; y: number },
  isActive: boolean = true
) => {
  const { sendCommand } = useSocket();
  const lastFetchTimeRef = useRef<number>(0);
  const timeoutRef = useRef<number | null>(null);
  const latestPosRef = useRef(cursorPos);

  useEffect(() => {
    latestPosRef.current = cursorPos;
  }, [cursorPos]);

  const sendMove = useCallback(
    (pos: { x: number; y: number }) => {
      if (!isActive) return;
      const params = { x: Math.round(pos.x), y: Math.round(pos.y) };
      sendCommand('POST /mouse/move', params);
      lastFetchTimeRef.current = Date.now();
    },
    [sendCommand, isActive]
  );

  useEffect(() => {
    const now = Date.now();
    const timeSinceLast = now - lastFetchTimeRef.current;

    if (timeSinceLast >= 50) {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      sendMove(cursorPos);
    } else if (!timeoutRef.current) {
      const delay = 50 - timeSinceLast;
      timeoutRef.current = window.setTimeout(() => {
        sendMove(latestPosRef.current);
        timeoutRef.current = null;
      }, delay);
    }
  }, [cursorPos, sendMove]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);
};
