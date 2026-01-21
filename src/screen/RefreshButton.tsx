import { MdRefresh } from 'react-icons/md';
import { DraggableButton } from './DraggableButton';
import './RefreshButton.css';

interface RefreshButtonProps {
    onClick: () => void;
    loading?: number;
}

export const RefreshButton = ({ onClick, loading }: RefreshButtonProps) => (
    <DraggableButton className={`screen-RefreshButton ${loading && loading > 0 ? 'loading' : ''}`} onClick={onClick} initialX={window.innerWidth - 64} initialY={16}>
        {loading && loading > 0 ? <span className="count">{loading}</span> : <MdRefresh className="icon" />}
    </DraggableButton>
);
