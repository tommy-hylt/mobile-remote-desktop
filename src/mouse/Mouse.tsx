import { useState } from 'react';
import type { ViewportState } from '../screen/ViewportState';
import { MouseControls } from './MouseControls';
import { MouseCursor } from './MouseCursor';
import './Mouse.css';

interface MouseProps {
    viewport: ViewportState;
}

export const Mouse = ({ viewport }: MouseProps) => {
    const [cursorPos, setCursorPos] = useState({ x: 960, y: 540 });
    const [isActive, setIsActive] = useState(false);

    const x = cursorPos.x * viewport.scale + viewport.u;
    const y = cursorPos.y * viewport.scale + viewport.v;

    return (
        <>
            <MouseCursor
                x={x}
                y={y}
                viewport={viewport}
                isActive={isActive}
                setIsActive={setIsActive}
                setCursorPos={setCursorPos}
            />
            <MouseControls
                x={x}
                y={y}
                isActive={isActive}
            />
        </>
    );
};
