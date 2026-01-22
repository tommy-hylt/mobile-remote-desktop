import { useEffect, useRef } from 'react';
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
  const { position, isDragging, handlers } = useDraggable({
    x: initialX,
    y: initialY,
  });
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = buttonRef.current;
    if (!el) return;

    const stopPropagation = (e: TouchEvent) => e.stopPropagation();

    // Attach to button for dragging logic if needed, but DraggableButton logic is hook based.
    // Actually the hook returns handlers to spread on the draggable element.
    // If we want the WHOLE thing to drag, we spread on wrapper.
    // But usually we drag by the button handle?
    // Let's spread handlers on the button, so dragging only happens when touching the button.
    // But if the menu is separate, it shouldn't trigger drag.
    // So handlers go on button.

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
        // Ensure wrapper doesn't block clicks to things behind it if it has no size?
        // But it contains button and menu.
        // We set display flex to keep things together? relative positioning works best.
      }}
    >
      {/* Menu rendered here to be relative to this container */}
      {menu}

      <button
        ref={buttonRef}
        className={`screen-DraggableButton ${className || ''}`}
        onClick={handleClick}
        {...handlers}
        // Remove style positioning from button, as wrapper handles it
        style={{
          // Reset styles that might interfere?
          // DraggableButton.css sets position absolute. We should probably override that to relative or static?
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
