import { useState } from 'react';

import { Cursor } from './Cursor';
import { LeftButton } from './LeftButton';
import { RightButton } from './RightButton';
import { ScrollButton } from './ScrollButton';

import type { ViewportState } from '../screen/ViewportState';

interface MouseProps {
  viewport: ViewportState;
}

export const Mouse = ({ viewport }: MouseProps) => {
  const [cursorPos, setCursorPos] = useState({ x: 960, y: 540 });
  const [isActive, setIsActive] = useState(false);
  const [offsets, setOffsets] = useState({
    left: { x: 0, y: 0 },
    right: { x: 0, y: 0 },
    scroll: { x: 0, y: 0 },
  });

  const x = cursorPos.x * viewport.scale + viewport.u;
  const y = cursorPos.y * viewport.scale + viewport.v;

  const BUTTON_OFFSET = 40;

  const updateOffset = (key: keyof typeof offsets, dx: number, dy: number) => {
    setOffsets((prev) => ({
      ...prev,
      [key]: { x: prev[key].x + dx, y: prev[key].y + dy },
    }));
  };

  return (
    <>
      <Cursor
        x={x}
        y={y}
        cursorPos={cursorPos}
        viewport={viewport}
        setIsActive={setIsActive}
        setCursorPos={setCursorPos}
      />
      {isActive && (
        <>
          <LeftButton
            x={x - BUTTON_OFFSET + offsets.left.x}
            y={y + offsets.left.y}
            onDrag={(dx, dy) => updateOffset('left', dx, dy)}
          />
          <ScrollButton
            x={x + offsets.scroll.x}
            y={y + BUTTON_OFFSET + offsets.scroll.y}
            onDrag={(dx, dy) => updateOffset('scroll', dx, dy)}
          />
          <RightButton
            x={x + BUTTON_OFFSET + offsets.right.x}
            y={y + offsets.right.y}
            onDrag={(dx, dy) => updateOffset('right', dx, dy)}
          />
        </>
      )}
    </>
  );
};
