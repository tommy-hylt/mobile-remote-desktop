import { useEffect, useRef } from 'react';
import type { Rect, ScreenSize } from '../types';

export const useTouchZoom = (
    containerRef: React.RefObject<HTMLDivElement | null>,
    area: Rect,
    screenSize: ScreenSize,
    onAreaChange: (area: Rect) => void
) => {
    const lastTouchRef = useRef<{ d: number; x: number; y: number } | null>(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                const t1 = e.touches[0];
                const t2 = e.touches[1];
                const d = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
                const x = (t1.clientX + t2.clientX) / 2;
                const y = (t1.clientY + t2.clientY) / 2;
                lastTouchRef.current = { d, x, y };
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length === 2 && lastTouchRef.current) {
                e.preventDefault();
                const t1 = e.touches[0];
                const t2 = e.touches[1];
                const d = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
                const x = (t1.clientX + t2.clientX) / 2;
                const y = (t1.clientY + t2.clientY) / 2;

                const prev = lastTouchRef.current;
                const scale = d / prev.d;

                const viewportW = el.clientWidth;
                const viewportH = el.clientHeight;

                let newW = area.w / scale;
                let newH = area.h / scale;

                if (newW > screenSize.width) newW = screenSize.width;
                if (newH > screenSize.height) newH = screenSize.height;
                if (newW < 100) newW = 100;
                if (newH < 100) newH = 100;

                const P_x = area.x + (prev.x / viewportW) * area.w;
                const P_y = area.y + (prev.y / viewportH) * area.h;

                const newX = P_x - (x / viewportW) * newW;
                const newY = P_y - (y / viewportH) * newH;

                onAreaChange({
                    x: Math.max(0, Math.min(newX, screenSize.width - newW)),
                    y: Math.max(0, Math.min(newY, screenSize.height - newH)),
                    w: newW,
                    h: newH
                });

                lastTouchRef.current = { d, x, y };
            }
        };

        const handleTouchEnd = () => {
            lastTouchRef.current = null;
        };

        el.addEventListener('touchstart', handleTouchStart, { passive: false });
        el.addEventListener('touchmove', handleTouchMove, { passive: false });
        el.addEventListener('touchend', handleTouchEnd);

        return () => {
            el.removeEventListener('touchstart', handleTouchStart);
            el.removeEventListener('touchmove', handleTouchMove);
            el.removeEventListener('touchend', handleTouchEnd);
        };
    }, [area, onAreaChange, screenSize, containerRef]);
};
