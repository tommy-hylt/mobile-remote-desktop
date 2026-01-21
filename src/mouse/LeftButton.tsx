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
            onPointerDown={(e) => {
                console.log('LeftButton: onPointerDown');
                e.preventDefault();
                e.stopPropagation();
                fetch('/mouse/left/down', { method: 'POST' })
                    .then(() => console.log('LeftButton: down sent'))
                    .catch(err => console.error('LeftButton: down failed', err));
            }}
            onPointerUp={(e) => {
                console.log('LeftButton: onPointerUp');
                e.preventDefault();
                e.stopPropagation();
                fetch('/mouse/left/up', { method: 'POST' })
                    .then(() => console.log('LeftButton: up sent'))
                    .catch(err => console.error('LeftButton: up failed', err));
            }}
        />
    );
};
