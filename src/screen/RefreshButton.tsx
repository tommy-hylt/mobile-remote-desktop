import { MdRefresh } from 'react-icons/md';
import { useDraggable } from './useDraggable';
import './RefreshButton.css';

interface RefreshButtonProps {
    onClick: () => void;
}

export const RefreshButton = ({ onClick }: RefreshButtonProps) => {
    const { position, isDragging, handlers } = useDraggable({ x: window.innerWidth - 64, y: 16 });

    const handleClick = () => {
        if (!isDragging.current) {
            onClick();
        }
    };

    return (
        <button
            className="screen-RefreshButton"
            onClick={handleClick}
            {...handlers}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                right: 'auto', // Override CSS right shorthand
            }}
        >
            <MdRefresh className="icon" />
        </button>
    );
};
