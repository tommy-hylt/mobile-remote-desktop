import { useRef } from 'react';
import './MouseControls.css';

interface MouseControlsProps {
    x: number;
    y: number;
    isActive: boolean;
}

export const MouseControls = ({ x, y, isActive }: MouseControlsProps) => {
    const scrollStartRef = useRef<number | null>(null);

    return (
        <div
            className={`mouse-MouseControls ${isActive ? 'active' : ''}`}
            style={{
                left: `${x}px`,
                top: `${y}px`,
            }}
        >
            <div
                className="dot left"
                onPointerDown={() => fetch('/mouse/left/down', { method: 'POST' })}
                onPointerUp={() => fetch('/mouse/left/up', { method: 'POST' })}
            />
            <div
                className="dot right"
                onPointerDown={() => fetch('/mouse/right/down', { method: 'POST' })}
                onPointerUp={() => fetch('/mouse/right/up', { method: 'POST' })}
            />
            <div
                className="dot middle"
                onTouchStart={(e) => {
                    e.stopPropagation();
                    const t = e.touches[0];
                    scrollStartRef.current = t.clientY;
                }}
                onTouchMove={(e) => {
                    e.stopPropagation();
                    if (scrollStartRef.current === null) return;
                    const t = e.touches[0];
                    const dy = t.clientY - scrollStartRef.current;

                    if (Math.abs(dy) > 10) {
                        fetch('/mouse/scroll', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ x: 0, y: Math.round(dy * -2) }),
                        });
                        scrollStartRef.current = t.clientY;
                    }
                }}
                onTouchEnd={(e) => {
                    e.stopPropagation();
                    scrollStartRef.current = null;
                }}
            />
        </div>
    );
};
