import type { Dispatch, SetStateAction } from 'react';
import { useEffect } from 'react';

import type { ScreenImage } from './ScreenImage';

export const useAutoQuality = (
  auto: boolean,
  outputImage: ScreenImage | null,
  setQuality: Dispatch<SetStateAction<number>>,
) => {
  useEffect(() => {
    if (!auto || !outputImage) return;
    const { duration } = outputImage;
    if (duration < 100) {
      setQuality((prev) => Math.min(100, prev + 10));
    } else if (duration > 5000) {
      setQuality((prev) => Math.max(20, prev - 10));
    }
  }, [auto, outputImage, setQuality]);
};
