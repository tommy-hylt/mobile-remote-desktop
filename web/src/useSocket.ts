import { useEffect, useRef, useCallback } from 'react';

type CommandParams = Record<string, unknown>;

export const useSocket = () => {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let timeoutId: number | null = null;
    let ws: WebSocket | null = null;

    const connect = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      ws = new WebSocket(`${protocol}//${host}/ws`);

      ws.onopen = () => {
        if (timeoutId) {
          window.clearTimeout(timeoutId);
          timeoutId = null;
        }
      };

      ws.onclose = () => {
        timeoutId = window.setTimeout(connect, 2000);
      };

      ws.onerror = () => {
        ws?.close();
      };

      socketRef.current = ws;
    };

    connect();

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      ws?.close();
      socketRef.current = null;
    };
  }, []);

  const sendCommand = useCallback((method: string, params: CommandParams = {}) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          id: Math.random().toString(36).substring(2),
          method,
          params,
        })
      );
      return true;
    }
    return false;
  }, []);

  return { sendCommand };
};