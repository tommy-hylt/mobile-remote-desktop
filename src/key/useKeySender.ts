import { useRef } from 'react';

export const useKeySender = () => {
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

      try {
        for (const key of keys) {
          await fetch(`/key/${encodeURIComponent(key)}/${action}`, {
            method: 'POST',
          });
        }
      } catch (e) {
        console.error(`Failed to send key ${action}`, e);
      }
    });

    return queueRef.current;
  };

  return { send };
};
