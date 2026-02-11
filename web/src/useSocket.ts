import { useEffect, useRef, useCallback } from 'react';

type CommandParams = Record<string, unknown>;
type MessageListener = (data: unknown) => void;

export const useSocket = () => {
  const socketRef = useRef<WebSocket | null>(null);
  const listenersRef = useRef<Set<MessageListener>>(new Set());

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

      ws.onmessage = (event) => {
        listenersRef.current.forEach((listener) => {
          if (typeof event.data === 'string') {
            try {
              listener(JSON.parse(event.data));
            } catch {
              listener(event.data);
            }
          } else {
            listener(event.data);
          }
        });
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

  const sendCommand = useCallback(
    (method: string, params: CommandParams = {}) => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        const id = Math.random().toString(36).substring(2);
        socketRef.current.send(
          JSON.stringify({
            id,
            method,
            params,
          })
        );
        return id;
      }
      return null;
    },
    []
  );

  const addListener = useCallback((listener: MessageListener) => {
    listenersRef.current.add(listener);
    return () => listenersRef.current.delete(listener);
  }, []);

  return { sendCommand, addListener };
};
