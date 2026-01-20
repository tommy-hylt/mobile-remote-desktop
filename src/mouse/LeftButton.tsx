import './LeftButton.css';

interface LeftButtonProps {
    x: number;
    y: number;
}

export const LeftButton = ({ x, y }: LeftButtonProps) => {
    return (
        <div
            className="mouse-LeftButton"
            style={{ left: `${x}px`, top: `${y}px` }}
            onPointerDown={() => fetch('/mouse/left/down', { method: 'POST' })}
            onPointerUp={() => fetch('/mouse/left/up', { method: 'POST' })}
        />
    );
};
