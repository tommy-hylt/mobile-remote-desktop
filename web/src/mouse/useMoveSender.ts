import { useRef, useEffect, useCallback } from 'react';

type CommandParams = Record<string, unknown>;

export const useMoveSender = (
  cursorPos: { x: number; y: number },
  sendCommand?: (method: string, params?: CommandParams) => string | null
) => {
  const lastFetchTimeRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestPosRef = useRef(cursorPos);

  useEffect(() => {
    latestPosRef.current = cursorPos;
  }, [cursorPos]);

  const sendMove = useCallback((pos: { x: number; y: number }) => {
    const params = { x: Math.round(pos.x), y: Math.round(pos.y) };
    sendCommand?.('POST /mouse/move', params);
    lastFetchTimeRef.current = Date.now();
  }, [sendCommand]);

  useEffect(() => {
    const now = Date.now();
    const timeSinceLast = now - lastFetchTimeRef.current;

    if (timeSinceLast >= 50) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      sendMove(cursorPos);
    } else if (!timeoutRef.current) {
      const delay = 50 - timeSinceLast;
      timeoutRef.current = setTimeout(() => {
        sendMove(latestPosRef.current);
        timeoutRef.current = null;
      }, delay);
    }
  }, [cursorPos, sendMove]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);
};