import { useEffect } from 'react';
import type { Rect } from './Rect';
import type { FiringItem, RequestItem } from './RequestItem';

export const useQueueScheduler = (
  setItems: React.Dispatch<React.SetStateAction<RequestItem[]>>,
  execute: (item: FiringItem, area: Rect) => Promise<void>,
  isDesktop?: boolean,
) => {
  useEffect(() => {
    const tick = () => {
      setItems((currentItems) => {
        const now = Date.now();

        const validItems = currentItems.filter((i) => {
          if (i.status === 'firing' && now - i.time > 300000) {
            i.controller.abort();
            return false;
          }
          return true;
        });

        const cleanupNeeded = validItems.length !== currentItems.length;
        const queuing = validItems.find((i) => i.status === 'queuing');
        const firingCount = validItems.filter(
          (i) => i.status === 'firing',
        ).length;

        if (queuing && firingCount === 0) {
          const firing: FiringItem = {
            status: 'firing',
            time: now,
            controller: new AbortController(),
            scale: queuing.scale,
          };

          execute(firing, queuing.area);
          return validItems.map((i) => (i === queuing ? firing : i));
        } else if (cleanupNeeded) {
          return validItems;
        }

        return currentItems;
      });
    };

    const interval = isDesktop ? 100 : 200;
    const timer = setInterval(tick, interval);
    return () => clearInterval(timer);
  }, [execute, setItems, isDesktop]);
};
