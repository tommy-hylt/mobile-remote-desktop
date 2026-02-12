import { useCallback } from 'react';
import type { Rect } from './Rect';
import { useSocket } from '../useSocket';

export interface CaptureResult {
  url: string;
  hash: string | null;
  time: number;
  duration: number;
}

interface CaptureMetadata {
  next_hash: string;
  date?: string;
}

export const useFetchCapture = () => {
  const { sendCommand, addListener } = useSocket();

  return useCallback(
    async (
      area: Rect,
      signal: AbortSignal,
      lastHash: string | null,
      scale: number = 1,
      quality: number = 90
    ): Promise<CaptureResult | null> => {
      const start = Date.now();
      const { x, y, w, h } = area;

      const areaStr = `${x},${y},${w},${h}`;
      let resize: string | undefined;
      if (scale < 1) {
        resize = `${Math.round(w * scale)},${Math.round(h * scale)}`;
      }

      if (sendCommand && addListener) {
        return new Promise((resolve) => {
          let metadata: CaptureMetadata | null = null;
          let requestId: string | null = null;

          const timeoutId = window.setTimeout(() => {
            removeListener();
            resolve(null);
          }, 180000);

          const removeListener = addListener((msg) => {
            if (signal.aborted) {
              window.clearTimeout(timeoutId);
              removeListener();
              resolve(null);
              return;
            }

            if (
              typeof msg === 'object' &&
              msg !== null &&
              'id' in msg &&
              msg.id === requestId
            ) {
              const response = msg as unknown as {
                status: number;
                data?: CaptureMetadata;
              };
              if (response.status === 204) {
                window.clearTimeout(timeoutId);
                removeListener();
                resolve(null);
              } else if (response.status === 200 && response.data) {
                metadata = response.data;
              } else {
                window.clearTimeout(timeoutId);
                removeListener();
                resolve(null);
              }
            } else if (metadata && msg instanceof Blob) {
              window.clearTimeout(timeoutId);
              removeListener();
              const url = URL.createObjectURL(msg);
              resolve({
                url,
                hash: metadata.next_hash,
                time: metadata.date ? Date.parse(metadata.date) : Date.now(),
                duration: Date.now() - start,
              });
            }
          });

          const params: Record<string, unknown> = {
            area: areaStr,
            quality,
          };
          if (resize) params.resize = resize;
          if (lastHash) params.last_hash = lastHash;

          requestId = sendCommand('GET /capture', params);
          if (!requestId) {
            removeListener();
            resolve(null);
          }
        });
      }

      const params = new URLSearchParams({ area: areaStr });
      if (quality !== 100) params.append('quality', quality.toString());
      if (resize) params.append('resize', resize);
      if (lastHash) params.append('last_hash', lastHash);

      if (signal.aborted) return null;

      try {
        const response = await fetch(`/capture?${params.toString()}`, {
          signal,
        });
        if (!response.ok || response.status === 204) return null;

        const nextHash = response.headers.get('Next-Hash') || null;
        const dateStr = response.headers.get('Date');
        const time = dateStr ? Date.parse(dateStr) : Date.now();
        const duration = Date.now() - start;

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        return { url, hash: nextHash, time, duration };
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return null;
        console.error('Capture error:', error);
        return null;
      }
    },
    [sendCommand, addListener]
  );
};
