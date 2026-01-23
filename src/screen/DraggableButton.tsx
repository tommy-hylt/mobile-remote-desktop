import { useEffect, useRef, useState } from 'react';
import './DraggableButton.css';
import { useDraggable } from './useDraggable';

import type { ReactNode } from 'react';

interface DraggableButtonProps {
  onClick: () => void;
  children: ReactNode;
  initialX: number;
  initialY: number;
  className?: string;
}

export const DraggableButton = ({
  onClick,
  children,
  initialX,
  initialY,
  className,
  menu,
}: DraggableButtonProps & { menu?: ReactNode }) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });

  const { isDragging, handlers } = useDraggable((dx, dy) => {
    setPosition((prev) => ({
      x: prev.x + dx,
      y: prev.y + dy,
    }));
  });

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
    <div
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 10,
      }}
    >
      {/* Menu rendered here to be relative to this container */}
      {menu}

      <button
        ref={buttonRef}
        className={`screen-DraggableButton ${className || ''}`}
        onClick={handleClick}
        {...handlers}
        style={{
          position: 'relative',
          left: 'auto',
          top: 'auto',
        }}
      >
        {children}
      </button>
    </div>
  );
};
