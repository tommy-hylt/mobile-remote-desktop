import type { Rect } from './Rect';

export interface QueuingItem {
  status: 'queuing';
  area: Rect;
  time: number;
}

export interface FiringItem {
  status: 'firing';
  time: number;
  controller: AbortController;
}

export type RequestItem = QueuingItem | FiringItem;
