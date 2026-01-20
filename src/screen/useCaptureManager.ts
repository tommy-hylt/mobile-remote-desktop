import { useMemo, useEffect } from 'react';
import type { ScreenImage } from './ScreenImage';
import { captureManager } from './captureManager';

export const useCaptureManager = (onImage: (img: ScreenImage) => void) => {
    const manager = useMemo(() => captureManager(onImage), [onImage]);

    useEffect(() => {
        const timer = setInterval(() => manager.tick(), 200);
        return () => clearInterval(timer);
    }, [manager]);

    return { enqueue: manager.enqueue };
};
