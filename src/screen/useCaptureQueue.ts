import { useState, useEffect, useCallback, useRef } from 'react';
import type { ScreenImage } from './ScreenImage';
import type { Rect } from './Rect';
import type { RequestItem, QueuingItem, FiringItem } from './RequestItem';

export const useCaptureQueue = () => {
  const [items, setItems] = useState<RequestItem[]>([]);
  const [outputImage, setOutputImage] = useState<ScreenImage | null>(null);
  const latestHashRef = useRef<string | null>(null);
  const itemsRef = useRef<RequestItem[]>([]);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const finish = useCallback((item: FiringItem) => {
    setItems((prev) => prev.filter((i) => i !== item));
  }, []);

  const execute = useCallback(
    async (item: FiringItem, area: Rect) => {
      const { x, y, w, h } = area;
      if (w <= 0 || h <= 0) {
        setItems((prev) => prev.filter((i) => i !== item));
        return;
      }

      try {
        const headers: Record<string, string> = {};
        if (latestHashRef.current) headers['Last-Hash'] = latestHashRef.current;
        const res = await fetch(`/capture?area=${x},${y},${w},${h}`, {
          headers,
          signal: item.controller.signal,
        });

        if (res.status === 204 || !res.ok) {
          finish(item);
          return;
        }

        const hash = res.headers.get('Next-Hash');
        const dateStr = res.headers.get('Date');
        const time = dateStr ? Date.parse(dateStr) : Date.now();

        const blob = await res.blob();
        latestHashRef.current = hash;

        // Clean up OTHER firing items (dump them)
        setItems((prev) => {
          const keep = prev.filter((i) => i === item || i.status !== 'firing');
          // Abort the dropped ones? captureManager logic says we should abort them.
          // The item passed to execute is 'item'. We want to keep it (will be updated to ended by finish).
          // Others that are firing should be aborted and removed.
          prev.forEach((i) => {
            if (i !== item && i.status === 'firing') {
              i.controller.abort();
            }
          });
          return keep;
        });

        setOutputImage({ url: URL.createObjectURL(blob), area, hash, time });
        finish(item);
      } catch (e) {
        if (e instanceof Error && e.name !== 'AbortError') {
          finish(item);
        }
      }
    },
    [finish],
  );

  const fire = useCallback(
    (area: Rect) => {
      const now = Date.now();
      const firing: FiringItem = {
        status: 'firing',
        time: now,
        controller: new AbortController(),
      };

      setItems((prev) => {
        const others = prev.filter((i) => i.status !== 'queuing');
        return [...others, firing];
      });

      execute(firing, area);
    },
    [execute],
  );

  const enqueue = useCallback((area: Rect) => {
    setItems((prev) => {
      const others = prev.filter((i) => i.status !== 'queuing');
      return [...others, { status: 'queuing', area, time: Date.now() }];
    });
  }, []);

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const currentItems = itemsRef.current;

      // Remove items that have timed out
      const validItems = currentItems.filter((i) => {
        if (i.status === 'firing' && now - i.time > 30000) {
          console.warn('captureManager: Aborting stale request');
          i.controller.abort();
          return false;
        }
        return true;
      });

      const cleanupNeeded = validItems.length !== currentItems.length;

      const queuing = validItems.find((i) => i.status === 'queuing') as
        | QueuingItem
        | undefined;
      const firingCount = validItems.filter(
        (i) => i.status === 'firing',
      ).length;

      // Simple rule: Only fire if nothing else is firing
      if (queuing && firingCount === 0) {
        console.log('captureManager: firing new request');
        const firing: FiringItem = {
          status: 'firing',
          time: now,
          controller: new AbortController(),
        };
        // Replace the queuing item with the new firing item
        const newItems = validItems.map((i) => (i === queuing ? firing : i));

        setItems(newItems);
        execute(firing, queuing.area);
      } else if (cleanupNeeded) {
        setItems(validItems);
      }
    };

    const timer = setInterval(tick, 200);
    return () => clearInterval(timer);
  }, [execute]);

  return { items, enqueue, fire, outputImage };
};
