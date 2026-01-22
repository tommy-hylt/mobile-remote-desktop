import { MdRefresh } from 'react-icons/md';
import { DraggableButton } from './DraggableButton';
import './RefreshButton.css';

import type { Rect } from './Rect';

interface RefreshButtonProps {
  fire: (area: Rect) => void;
  area: Rect;
  loading: number;
}

export const RefreshButton = ({ fire, area, loading }: RefreshButtonProps) => {
  return (
    <DraggableButton
      className={`screen-RefreshButton ${loading > 0 ? 'loading' : ''}`}
      onClick={() => {
        if (area.w > 0 && area.h > 0) {
          fire(area);
        }
      }}
      initialX={window.innerWidth - 64}
      initialY={16}
    >
      {loading > 1 ? (
        <span className="count">{loading}</span>
      ) : (
        <MdRefresh className="icon" />
      )}
    </DraggableButton>
  );
};
