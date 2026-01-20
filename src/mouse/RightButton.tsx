import './RightButton.css';

interface RightButtonProps {
    x: number;
    y: number;
}

export const RightButton = ({ x, y }: RightButtonProps) => {
    return (
        <div
            className="mouse-RightButton"
            style={{ left: `${x}px`, top: `${y}px` }}
            onPointerDown={() => fetch('/mouse/right/down', { method: 'POST' })}
            onPointerUp={() => fetch('/mouse/right/up', { method: 'POST' })}
        />
    );
};
