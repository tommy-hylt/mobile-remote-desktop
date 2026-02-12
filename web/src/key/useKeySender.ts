import { useRef } from 'react';
import { useSocket } from '../useSocket';

export const useKeySender = () => {
  const { sendCommand } = useSocket();
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

        if (sendCommand(`POST /key/${safeKey}/${action}`)) {
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
