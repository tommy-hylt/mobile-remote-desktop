import { MdZoomOutMap } from 'react-icons/md';
import { DraggableButton } from './DraggableButton';
import './ZoomOutButton.css';

interface ZoomOutButtonProps {
    onClick: () => void;
}

export const ZoomOutButton = ({ onClick }: ZoomOutButtonProps) => (
    <DraggableButton className="screen-ZoomOutButton" onClick={onClick} initialX={16} initialY={16}>
        <MdZoomOutMap className="icon" />
    </DraggableButton>
);
