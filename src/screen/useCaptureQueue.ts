import { useState, useCallback, useRef } from 'react';
import type { ScreenImage } from './ScreenImage';
import type { Rect } from './Rect';
import type { RequestItem, FiringItem } from './RequestItem';
import { useFetchCapture } from './useFetchCapture';
import { useQueueScheduler } from './useQueueScheduler';

export const useCaptureQueue = () => {
  const [items, setItems] = useState<RequestItem[]>([]);
  const [outputImage, setOutputImage] = useState<ScreenImage | null>(null);
  const latestHashRef = useRef<string | null>(null);
  const fetchCapture = useFetchCapture();

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
      } catch {}
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

  useQueueScheduler(setItems, execute);

  return { items, enqueue, fire, outputImage };
};
