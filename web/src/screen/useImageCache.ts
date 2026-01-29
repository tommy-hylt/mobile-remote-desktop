import { useReducer, useEffect } from 'react';
import type { ScreenImage } from './ScreenImage';
import type { Rect } from './Rect';

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

const imageReducer = (state: ScreenImage[], image: ScreenImage) => {
  const oldImages = state.filter(
    (i) => getCoverageRatio(i.area, image.area) < 1,
  );
  const sortedImages = [...oldImages].sort(
    (a, b) =>
      getCoverageRatio(a.area, image.area) -
      getCoverageRatio(b.area, image.area),
  );
  const keptImages = oldImages.filter((c) => sortedImages.indexOf(c) < 2);
  return [...keptImages, image];
};

export const useImageCache = (outputImage: ScreenImage | null) => {
  const [images, dispatch] = useReducer(imageReducer, []);

  useEffect(() => {
    if (outputImage) {
      dispatch(outputImage);
    }
  }, [outputImage]);

  return { images };
};
