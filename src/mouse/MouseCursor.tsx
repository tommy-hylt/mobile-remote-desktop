import { useRef } from 'react';
import type { ViewportState } from '../screen/ViewportState';
import './Mouse.css';

interface MouseCursorProps {
    x: number;
    y: number;
    viewport: ViewportState;
    isActive: boolean;
    setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
    setCursorPos: React.Dispatch<React.SetStateAction<{ x: number, y: number }>>;
}

export const MouseCursor = ({
    x, y, viewport, isActive, setIsActive, setCursorPos
}: MouseCursorProps) => {
    const lastPosRef = useRef<{ x: number, y: number } | null>(null);

    return (
        <div
            className={`mouse-Mouse center-close ${isActive ? 'active' : ''}`}
            style={{
                left: `${x}px`,
                top: `${y}px`,
            }}
            onClick={(e) => {
                e.stopPropagation();
                setIsActive(prev => !prev);
            }}
            onTouchStart={(e) => {
                e.stopPropagation();
                const t = e.touches[0];
                lastPosRef.current = { x: t.clientX, y: t.clientY };
            }}
            onTouchMove={(e) => {
                e.stopPropagation();
                if (!lastPosRef.current) return;

                const t = e.touches[0];
                const dx = t.clientX - lastPosRef.current.x;
                const dy = t.clientY - lastPosRef.current.y;
                const remoteDx = dx / viewport.scale;
                const remoteDy = dy / viewport.scale;

                setCursorPos(prev => {
                    const nextX = Math.max(0, prev.x + remoteDx);
                    const nextY = Math.max(0, prev.y + remoteDy);

                    fetch('/mouse/move', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ x: Math.round(nextX), y: Math.round(nextY) }),
                    });

                    return { x: nextX, y: nextY };
                });

                lastPosRef.current = { x: t.clientX, y: t.clientY };
            }}
            onTouchEnd={(e) => {
                e.stopPropagation();
                lastPosRef.current = null;
            }}
        />
    );
};
