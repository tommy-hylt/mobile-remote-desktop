import { useState, useCallback, useEffect } from 'react';
import type { Rect } from '../types';

export interface ScreenImage {
    url: string;
    area: Rect;
}

export const useScreenImages = (area: Rect) => {
    const [images, setImages] = useState<ScreenImage[]>([]);

    const fetchCapture = useCallback(async () => {
        const params = new URLSearchParams({
            x: Math.round(area.x).toString(),
            y: Math.round(area.y).toString(),
            w: Math.round(area.w).toString(),
            h: Math.round(area.h).toString(),
        });

        try {
            const response = await fetch(`/capture?${params.toString()}`);
            if (!response.ok || response.status === 204) return;

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            setImages((prev) => {
                const newImage: ScreenImage = { url, area: { ...area } };
                const newImages = [...prev, newImage];
                return newImages.length > 3 ? newImages.slice(newImages.length - 3) : newImages;
            });
        } catch (error) {
            console.error(error);
        }
    }, [area]);

    useEffect(() => {
        const timer = setTimeout(fetchCapture, 100);
        return () => clearTimeout(timer);
    }, [fetchCapture]);

    return { images, fetchCapture };
};
