import { useState, useEffect, useCallback, useRef } from 'react';
import type { ScreenImage } from './ScreenImage';
import type { Rect } from './Rect';
import type { RequestItem, QueuingItem, FiringItem } from './RequestItem';
import { useFetchCapture } from './useFetchCapture';

export const useCaptureQueue = () => {
  const [items, setItems] = useState<RequestItem[]>([]);
  const [outputImage, setOutputImage] = useState<ScreenImage | null>(null);
  const latestHashRef = useRef<string | null>(null);
  const itemsRef = useRef<RequestItem[]>([]);
  const fetchCapture = useFetchCapture();

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const finish = useCallback((item: FiringItem) => {
    setItems((prev) => prev.filter((i) => i !== item));
  }, []);

  const execute = useCallback(
    async (item: FiringItem, area: Rect) => {
      const { w, h } = area;
      if (w <= 0 || h <= 0) {
        setItems((prev) => prev.filter((i) => i !== item));
        return;
      }

      try {
        const result = await fetchCapture(
          area,
          item.controller.signal,
          latestHashRef.current,
          item.scale,
        );

        if (!result) {
          finish(item);
          return;
        }

        const { url, hash, time } = result;
        latestHashRef.current = hash;

        setItems((prev) => {
          const keep = prev.filter((i) => i === item || i.status !== 'firing');
          prev.forEach((i) => {
            if (i !== item && i.status === 'firing') {
              i.controller.abort();
            }
          });
          return keep;
        });

        setOutputImage({ url, area, hash, time });
        finish(item);
      } catch {
        // AbortError is ignored
      }
    },
    [finish, fetchCapture],
  );

  const fire = useCallback(
    (area: Rect, scale: number = 1) => {
      const firing: FiringItem = {
        status: 'firing',
        time: Date.now(),
        controller: new AbortController(),
        scale,
      };

      setItems((prev) => [
        ...prev.filter((i) => i.status !== 'queuing'),
        firing,
      ]);

      execute(firing, area);
    },
    [execute],
  );

  const enqueue = useCallback((area: Rect, scale: number = 1) => {
    setItems((prev) => [
      ...prev.filter((i) => i.status !== 'queuing'),
      { status: 'queuing', area, time: Date.now(), scale },
    ]);
  }, []);

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const currentItems = itemsRef.current;

      const validItems = currentItems.filter((i) => {
        if (i.status === 'firing' && now - i.time > 300000) {
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

      if (queuing && firingCount === 0) {
        const firing: FiringItem = {
          status: 'firing',
          time: now,
          controller: new AbortController(),
          scale: queuing.scale,
        };
        setItems(validItems.map((i) => (i === queuing ? firing : i)));
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
