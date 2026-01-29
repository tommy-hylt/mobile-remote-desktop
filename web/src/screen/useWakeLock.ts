import { useCallback, useEffect, useRef } from 'react';

export const useWakeLock = () => {
  const wakeLock = useRef<WakeLockSentinel | null>(null);

  const requestLock = useCallback(async () => {
    if ('wakeLock' in navigator) {
      try {
        wakeLock.current = await navigator.wakeLock.request('screen');
        // removed log
      } catch (err) {
        if (err instanceof Error) {
          console.error(`${err.name}, ${err.message}`);
        }
      }
    }
  }, []);

  const releaseLock = useCallback(async () => {
    if (wakeLock.current) {
      await wakeLock.current.release();
      wakeLock.current = null;
      // removed log
    }
  }, []);

  useEffect(() => {
    requestLock();

    const handleVisibilityChange = () => {
      if (wakeLock.current !== null && document.visibilityState === 'visible') {
        requestLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      releaseLock();
    };
  }, [requestLock, releaseLock]);
};
