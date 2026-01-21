import { useRef, useEffect } from 'react';
import { useDraggable } from './useDraggable';
import './DraggableButton.css';

import type { ReactNode } from 'react';

interface DraggableButtonProps {
    onClick: () => void;
    children: ReactNode;
    initialX: number;
    initialY: number;
    className?: string;
}

export const DraggableButton = ({ onClick, children, initialX, initialY, className }: DraggableButtonProps) => {
    const { position, isDragging, handlers } = useDraggable({ x: initialX, y: initialY });
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const el = buttonRef.current;
        if (!el) return;

        const stopPropagation = (e: TouchEvent) => e.stopPropagation();

        el.addEventListener('touchstart', stopPropagation, { passive: false });

        return () => {
            el.removeEventListener('touchstart', stopPropagation);
        };
    }, []);

    const handleClick = () => {
        if (!isDragging.current) {
            onClick();
        }
    };

    return (
        <button
            ref={buttonRef}
            className={`screen-DraggableButton ${className || ''}`}
            onClick={handleClick}
            {...handlers}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
            }}
        >
            {children}
        </button>
    );
};
