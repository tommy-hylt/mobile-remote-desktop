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
    const handleRefresh = () => {
        if (area.w > 0 && area.h > 0) {
            fire(area);
        }
    };

    return (
        <DraggableButton className={`screen-RefreshButton ${loading && loading > 0 ? 'loading' : ''}`} onClick={handleRefresh} initialX={window.innerWidth - 64} initialY={16}>
            {loading && loading > 0 ? <span className="count">{loading}</span> : <MdRefresh className="icon" />}
        </DraggableButton>
    );
};
