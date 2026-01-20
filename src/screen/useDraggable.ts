import { useState, useRef } from 'react';

interface Position {
    x: number;
    y: number;
}

export const useDraggable = (initialPosition: Position) => {
    const [position, setPosition] = useState(initialPosition);
    const isDragging = useRef(false);
    const dragStartPos = useRef<Position | null>(null);

    const handlePointerDown = (e: React.PointerEvent) => {
        isDragging.current = false;
        dragStartPos.current = { x: e.clientX, y: e.clientY };
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (dragStartPos.current) {
            const dx = e.clientX - dragStartPos.current.x;
            const dy = e.clientY - dragStartPos.current.y;

            if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
                isDragging.current = true;
            }

            setPosition((prev) => ({
                x: prev.x + dx,
                y: prev.y + dy,
            }));

            dragStartPos.current = { x: e.clientX, y: e.clientY };
        }
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        dragStartPos.current = null;
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    };

    return {
        position,
        isDragging,
        handlers: {
            onPointerDown: handlePointerDown,
            onPointerMove: handlePointerMove,
            onPointerUp: handlePointerUp,
        },
    };
};
