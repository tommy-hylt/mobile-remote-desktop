import { useCallback } from 'react';
import type { Rect } from './Rect';

export interface CaptureResult {
  url: string;
  hash: string | null;
  time: number;
  duration: number;
}

export const useFetchCapture = () => {
  return useCallback(
    async (
      area: Rect,
      signal: AbortSignal,
      lastHash: string | null,
      scale: number = 1,
      quality: number = 90,
    ): Promise<CaptureResult | null> => {
      const start = Date.now();
      const { x, y, w, h } = area;
      const params = new URLSearchParams({
        area: `${x},${y},${w},${h}`,
      });

      if (quality !== 100) {
        params.append('quality', quality.toString());
      }

      if (scale < 1) {
        const resizeW = Math.round(w * scale);
        const resizeH = Math.round(h * scale);
        params.append('resize', `${resizeW},${resizeH}`);
      }

      if (lastHash) params.append('last_hash', lastHash);

      if (signal.aborted) return null;

      try {
        const response = await fetch(`/capture?${params.toString()}`, {
          signal,
        });

        if (!response.ok || response.status === 204) return null;

        const nextHash = response.headers.get('X-Next-Hash') || null;
        const dateStr = response.headers.get('X-Date');
        const time = dateStr ? Date.parse(dateStr) : Date.now();
        const duration = Date.now() - start;

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        return { url, hash: nextHash, time, duration };
      } catch (error) {
        if (
          typeof error === 'object' &&
          error !== null &&
          'name' in error &&
          (error as Error).name === 'AbortError'
        ) {
          return null;
        }
        console.error('Capture error:', error);
        return null;
      }
    },
    [],
  );
};
