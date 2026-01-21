import { useMemo } from 'react';
import type { ViewportState } from './ViewportState';
import type { ScreenSize } from './ScreenSize';

export const useArea = (viewport: ViewportState, screenSize: ScreenSize) => {
  return useMemo(() => {
    const visibleX = -viewport.u / viewport.scale;
    const visibleY = -viewport.v / viewport.scale;
    const visibleW = window.innerWidth / viewport.scale;
    const visibleH = window.innerHeight / viewport.scale;

    const x = Math.round(Math.max(0, visibleX));
    const y = Math.round(Math.max(0, visibleY));
    const w = Math.round(Math.min(screenSize.width - x, visibleW));
    const h = Math.round(Math.min(screenSize.height - y, visibleH));

    return { x, y, w, h };
  }, [viewport, screenSize]);
};
