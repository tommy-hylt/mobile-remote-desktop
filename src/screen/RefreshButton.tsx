import { MdRefresh } from 'react-icons/md';
import { DraggableButton } from './DraggableButton';
import './RefreshButton.css';

interface RefreshButtonProps {
    onClick: () => void;
}

export const RefreshButton = ({ onClick }: RefreshButtonProps) => (
    <DraggableButton className="screen-RefreshButton" onClick={onClick} initialX={window.innerWidth - 64} initialY={16}>
        <MdRefresh className="icon" />
    </DraggableButton>
);
