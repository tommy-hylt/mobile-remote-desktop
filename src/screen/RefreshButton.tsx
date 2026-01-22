import { useState } from 'react';
import { MdClose, MdRefresh } from 'react-icons/md';
import { DraggableButton } from './DraggableButton';
import './RefreshButton.css';
import { RefreshMenu } from './RefreshMenu';

import type { Rect } from './Rect';

interface RefreshButtonProps {
  fire: (area: Rect) => void;
  area: Rect;
  loading: number;
  quality: number;
  setQuality: (q: number) => void;
  auto: boolean;
  setAuto: (a: boolean) => void;
}

export const RefreshButton = ({
  fire,
  area,
  loading,
  quality,
  setQuality,
  auto,
  setAuto,
}: RefreshButtonProps) => {
  const [open, setOpen] = useState(false);

  return (
    <DraggableButton
      className="screen-RefreshButton"
      onClick={() => setOpen((prev) => !prev)}
      initialX={window.innerWidth - 64}
      initialY={16}
    >
      <div
        className={`icon-container ${!open && loading > 0 ? 'loading' : ''}`}
      >
        {open ? (
          <MdClose />
        ) : loading > 1 ? (
          <span>{loading}</span>
        ) : (
          <MdRefresh />
        )}
      </div>
      {open && (
        <RefreshMenu
          quality={quality}
          setQuality={setQuality}
          auto={auto}
          setAuto={setAuto}
          onRefresh={() => {
            if (area.w > 0 && area.h > 0) fire(area);
          }}
          onClose={() => setOpen(false)}
        />
      )}
    </DraggableButton>
  );
};
