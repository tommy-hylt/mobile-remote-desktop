import { useState } from 'react';
import type { ViewportState } from '../screen/ViewportState';
import { Cursor } from './Cursor';
import { LeftButton } from './LeftButton';
import { RightButton } from './RightButton';
import { ScrollButton } from './ScrollButton';

interface MouseProps {
    viewport: ViewportState;
}

export const Mouse = ({ viewport }: MouseProps) => {
    const [cursorPos, setCursorPos] = useState({ x: 960, y: 540 });
    const [isActive, setIsActive] = useState(false);

    const x = cursorPos.x * viewport.scale + viewport.u;
    const y = cursorPos.y * viewport.scale + viewport.v;

    // Offsets for buttons relative to cursor
    // Reducing shift to match smaller button size if needed, but keeping 60px as base for now
    const SHIFT = 60;

    return (
        <>
            <Cursor
                x={x}
                y={y}
                viewport={viewport}
                setIsActive={setIsActive}
                setCursorPos={setCursorPos}
            />
            {isActive && (
                <>
                    <LeftButton x={x - SHIFT} y={y} />
                    <ScrollButton x={x} y={y + SHIFT} />
                    <RightButton x={x + SHIFT} y={y} />
                </>
            )}
        </>
    );
};
