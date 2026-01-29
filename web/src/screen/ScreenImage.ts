import type { Rect } from './Rect';

export interface ScreenImage {
  url: string;
  area: Rect;
  hash: string | null;
  time: number;
  duration: number;
}
