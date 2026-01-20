import { useEffect, useState, useCallback } from 'react';
import type { ViewportState } from './ViewportState';
import type { ScreenSize } from './ScreenSize';
import type { Rect } from './Rect';
import type { ScreenImage } from './ScreenImage';
import { useCaptureManager } from './useCaptureManager';

export const useScreenImages = (viewport: ViewportState, screenSize: ScreenSize) => {
    const [images, setImages] = useState<ScreenImage[]>([]);

    const handleImage = useCallback((img: ScreenImage) => {
        setImages((prev) => {
            const oldImages = prev.filter((i) => getCoverageRatio(i.area, img.area) < 1);
            const sortedImages = [...oldImages].sort(
                (a, b) => getCoverageRatio(a.area, img.area) - getCoverageRatio(b.area, img.area));
            const keptImages = oldImages.filter(c => sortedImages.indexOf(c) < 2);
            return [...keptImages, img];
        });
    }, []);

    const { enqueue } = useCaptureManager(handleImage);

    const calcArea = useCallback(() => {
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

    useEffect(() => {
        const tick = () => {
            const area = calcArea();
            if (area.w > 0 && area.h > 0) {
                enqueue(area);
            }
        };

        const t = setInterval(tick, 1000);
        return () => clearInterval(t);
    }, [calcArea, enqueue]);

    return {
        images,
        fetchCapture: () => {
            const area = calcArea();
            if (area.w > 0 && area.h > 0) {
                enqueue(area);
            }
        }
    };
};

const getCoverageRatio = (subject: Rect, covering: Rect): number => {
    const x = Math.max(subject.x, covering.x);
    const y = Math.max(subject.y, covering.y);
    const w = Math.min(subject.x + subject.w, covering.x + covering.w) - x;
    const h = Math.min(subject.y + subject.h, covering.y + covering.h) - y;
    if (w <= 0 || h <= 0) return 0;
    const intersectionArea = w * h;
    const subjectArea = subject.w * subject.h;
    return subjectArea > 0 ? intersectionArea / subjectArea : 0;
};
