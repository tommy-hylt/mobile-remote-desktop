import { useState } from 'react';

import { Cursor } from './Cursor';
import { LeftButton } from './LeftButton';
import { RightButton } from './RightButton';
import { ScrollButton } from './ScrollButton';

import type { ViewportState } from '../screen/ViewportState';

interface MouseProps {
    viewport: ViewportState;
}

export const Mouse = ({ viewport }: MouseProps) => {
    const [cursorPos, setCursorPos] = useState({ x: 960, y: 540 });
    const [isActive, setIsActive] = useState(false);

    const x = cursorPos.x * viewport.scale + viewport.u;
    const y = cursorPos.y * viewport.scale + viewport.v;

    const BUTTON_OFFSET = 40;

    return (
        <>
            <Cursor
                x={x}
                y={y}
                cursorPos={cursorPos}
                viewport={viewport}
                setIsActive={setIsActive}
                setCursorPos={setCursorPos}
            />
            {isActive && (
                <>
                    <LeftButton x={x - BUTTON_OFFSET} y={y} />
                    <ScrollButton x={x} y={y + BUTTON_OFFSET} />
                    <RightButton x={x + BUTTON_OFFSET} y={y} />
                </>
            )}
        </>
    );
};
