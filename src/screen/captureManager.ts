import type { Rect } from './Rect';
import type { ScreenImage } from './ScreenImage';
import type { RequestItem, QueuingItem, FiringItem, EndedItem } from './RequestItem';

export const captureManager = (onImage: (img: ScreenImage) => void) => {
    let items: RequestItem[] = [];
    let latestHash: string | null = null;

    const finish = (item: FiringItem, duration: number) => {
        items = items.map(i => i === item ? { status: 'ended', time: item.time, duration } as EndedItem : i);
    };

    const execute = async (item: FiringItem, area: Rect) => {
        const { x, y, w, h } = area;
        if (w <= 0 || h <= 0) {
            items = items.filter(i => i !== item);
            return;
        }

        try {
            const headers: Record<string, string> = {};
            if (latestHash) headers['Last-Hash'] = latestHash;
            const res = await fetch(`/capture?area=${x},${y},${w},${h}`, { headers, signal: item.controller.signal });
            const duration = Date.now() - item.time;

            if (res.status === 204 || !res.ok) {
                finish(item, duration);
                return;
            }

            const hash = res.headers.get('Next-Hash');
            const blob = await res.blob();
            latestHash = hash;
            onImage({ url: URL.createObjectURL(blob), area, hash });
            finish(item, duration);
        } catch (e) {
            if (e instanceof Error && e.name !== 'AbortError') {
                finish(item, 3000);
            }
        }
    };

    const tick = () => {
        const now = Date.now();

        items = items.map(item => {
            if (item.status === 'firing' && now - item.time > 180000) {
                item.controller.abort();
                return { status: 'ended', time: item.time, duration: 180000 } as EndedItem;
            }
            return item;
        });

        const lastFire = items.reduce((max, i) =>
            (i.status === 'firing' || i.status === 'ended') ? Math.max(max, i.time) : max, 0);

        const recent = items.filter(i => i.status === 'ended').slice(-5) as EndedItem[];
        const avg = recent.length ? recent.reduce((s, i) => s + i.duration, 0) / recent.length : 4000;
        const interval = Math.min(Math.max(avg / 2, 0), 30000);

        const queuing = items.find(i => i.status === 'queuing') as QueuingItem | undefined;
        const firingCount = items.filter(i => i.status === 'firing').length;

        if (queuing && now - lastFire > interval && firingCount < 4) {
            const firing: FiringItem = { status: 'firing', time: now, controller: new AbortController() };
            items = items.map(i => i === queuing ? firing : i);
            execute(firing, queuing.area);
        }
    };

    return {
        enqueue: (area: Rect) => {
            const others = items.filter(i => i.status !== 'queuing');
            items = [...others, { status: 'queuing', area, time: Date.now() }];
        },
        tick
    };
};
