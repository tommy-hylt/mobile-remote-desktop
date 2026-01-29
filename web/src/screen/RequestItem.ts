import type { Rect } from './Rect';

export interface QueuingItem {
  status: 'queuing';
  area: Rect;
  time: number;
  scale?: number;
}

export interface FiringItem {
  status: 'firing';
  time: number;
  controller: AbortController;
  scale?: number;
}

export type RequestItem = QueuingItem | FiringItem;
