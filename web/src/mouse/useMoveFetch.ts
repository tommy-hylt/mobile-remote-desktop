import { useRef, useEffect, useCallback } from 'react';

export const useMoveFetch = (
  cursorPos: { x: number; y: number },
  sendCommand?: (method: string, params?: Record<string, unknown>) => string | null
) => {
  const lastFetchTimeRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestPosRef = useRef(cursorPos);

  useEffect(() => {
    latestPosRef.current = cursorPos;
  }, [cursorPos]);

  const sendMove = useCallback((pos: { x: number; y: number }) => {
    const params = { x: Math.round(pos.x), y: Math.round(pos.y) };
    
    if (!sendCommand?.('POST /mouse/move', params)) {
      fetch('/mouse/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      }).catch((e) => console.error(e));
    }
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