import { useRef } from 'react';

type CommandParams = Record<string, unknown>;

export const useKeySender = (
  sendCommand?: (method: string, params?: CommandParams) => boolean
) => {
  const queueRef = useRef<Promise<void>>(Promise.resolve());

  const parseKeys = (keyString: string): string[] => {
    return keyString
      .split(/[ +]+/)
      .map((k) => k.trim().toLowerCase())
      .filter((k) => k.length > 0);
  };

  const send = async (keyString: string, action: 'down' | 'up') => {
    queueRef.current = queueRef.current.then(async () => {
      const keys = parseKeys(keyString);
      if (action === 'up') keys.reverse();

      for (const key of keys) {
        const safeKey = key === '.' ? 'period' : key;

        // WebSocket doesn't need encoding as it's parsed directly by slicing
        if (sendCommand?.(`POST /key/${safeKey}/${action}`)) {
          continue;
        }

        try {
          await fetch(`/key/${encodeURIComponent(safeKey)}/${action}`, {
            method: 'POST',
          });
        } catch (e) {
          console.error(`Failed to send key ${action}`, e);
        }
      }
    });

    return queueRef.current;
  };

  return { send };
};