import { useState, useEffect, useCallback, useRef } from 'react';
import type { ScreenImage } from './ScreenImage';
import type { Rect } from './Rect';
import type { RequestItem, QueuingItem, FiringItem, EndedItem } from './RequestItem';

export const useCaptureManager = (onImage: (img: ScreenImage) => void) => {
    const [items, setItems] = useState<RequestItem[]>([]);
    const latestHashRef = useRef<string | null>(null);
    const itemsRef = useRef<RequestItem[]>([]); // Ref to access latest items in async/interval

    // Sync ref with state
    useEffect(() => {
        itemsRef.current = items;
    }, [items]);

    const finish = useCallback((item: FiringItem, duration: number) => {
        setItems(prev => prev.map(i => i === item ? { status: 'ended', time: item.time, duration } as EndedItem : i));
    }, []);

    const execute = useCallback(async (item: FiringItem, area: Rect) => {
        const { x, y, w, h } = area;
        if (w <= 0 || h <= 0) {
            setItems(prev => prev.filter(i => i !== item));
            return;
        }

        try {
            const headers: Record<string, string> = {};
            if (latestHashRef.current) headers['Last-Hash'] = latestHashRef.current;
            const res = await fetch(`/capture?area=${x},${y},${w},${h}`, { headers, signal: item.controller.signal });
            const duration = Date.now() - item.time;

            if (res.status === 204 || !res.ok) {
                finish(item, duration);
                return;
            }

            const hash = res.headers.get('Next-Hash');
            const blob = await res.blob();
            latestHashRef.current = hash;
            onImage({ url: URL.createObjectURL(blob), area, hash });
            finish(item, duration);
        } catch (e) {
            if (e instanceof Error && e.name !== 'AbortError') {
                finish(item, 3000);
            }
        }
    }, [onImage, finish]);

    const fire = useCallback((area: Rect) => {
        const now = Date.now();
        const firing: FiringItem = { status: 'firing', time: now, controller: new AbortController() };

        setItems(prev => {
            // Remove any queuing items to avoid double fire if user manually refreshes
            const others = prev.filter(i => i.status !== 'queuing');
            return [...others, firing];
        });

        execute(firing, area);
    }, [execute]);

    const enqueue = useCallback((area: Rect) => {
        setItems(prev => {
            const others = prev.filter(i => i.status !== 'queuing');
            return [...others, { status: 'queuing', area, time: Date.now() }];
        });
    }, []);

    // Tick logic
    useEffect(() => {
        const tick = () => {
            const now = Date.now();
            const currentItems = itemsRef.current; // Use ref to get latest without dependency loop

            // Cleanup old
            const validItems = currentItems.filter(i => i.status !== 'ended' || (now - i.time < 10000));
            const cleanupNeeded = validItems.length !== currentItems.length;

            let nextItems = validItems.map(item => {
                if (item.status === 'firing' && now - item.time > 30000) {
                    console.warn('captureManager: Aborting stale request');
                    item.controller.abort();
                    return { status: 'ended', time: item.time, duration: 30000 } as EndedItem;
                }
                return item;
            });

            const lastFire = nextItems.reduce((max, i) =>
                (i.status === 'firing' || i.status === 'ended') ? Math.max(max, i.time) : max, 0);

            const recent = nextItems.filter(i => i.status === 'ended').slice(-5) as EndedItem[];
            const avg = recent.length ? recent.reduce((s, i) => s + i.duration, 0) / recent.length : 1000;
            const interval = Math.min(Math.max(avg / 2, 0), 5000);

            const queuing = nextItems.find(i => i.status === 'queuing') as QueuingItem | undefined;
            const firingCount = nextItems.filter(i => i.status === 'firing').length;

            if (queuing && now - lastFire > interval && firingCount < 3) {
                console.log('captureManager: firing new request');
                const firing: FiringItem = { status: 'firing', time: now, controller: new AbortController() };
                nextItems = nextItems.map(i => i === queuing ? firing : i);

                // Update state and execute
                setItems(nextItems);
                execute(firing, queuing.area);
            } else if (cleanupNeeded || nextItems !== validItems) {
                // Update state if we cleaned up or aborted
                // Note: we can't easily detect "nextItems !== validItems" equality for objects, 
                // but strict equality works if map returned new objects.
                // Actually map always returns new array.
                setItems(nextItems);
            }
        };

        const timer = setInterval(tick, 200);
        return () => clearInterval(timer);
    }, [execute]); // Dependencies? execute depends on onImage/finish which are stable-ish.

    return { items, enqueue, fire };
};
