import { useEffect, useRef, useState } from 'react';

import { RefreshButton } from './RefreshButton';
import './Screen.css';
import type { ScreenSize } from './ScreenSize';
import { useArea } from './useArea';
import { useAutoQuality } from './useAutoQuality';
import { useCaptureQueue } from './useCaptureQueue';
import { useDragPan } from './useDragPan';
import { useImageCache } from './useImageCache';
import { usePinchZoom } from './usePinchZoom';
import type { ViewportState } from './ViewportState';
import { ZoomOutButton } from './ZoomOutButton';
import { DesktopMouse } from '../mouse/DesktopMouse';
import { useMoveSender } from '../mouse/useMoveSender';
import { useDesktopMouseEvents } from '../mouse/useDesktopMouseEvents';

export interface ScreenProps {
  viewport: ViewportState;
  screenSize: ScreenSize;
  setViewport: (viewport: ViewportState) => void;
  isDesktop?: boolean;
}

export const Screen = ({
  viewport,
  screenSize,
  setViewport,
  isDesktop,
}: ScreenProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cursorPos, setCursorPos] = useState({ x: 960, y: 540 });

  const [quality, setQuality] = useState(100);
  const [auto, setAuto] = useState(true);

  const { enqueue, fire, outputImage, items } = useCaptureQueue(
    quality,
    isDesktop
  );
  const { images } = useImageCache(outputImage);
  const area = useArea(viewport, screenSize);

  useAutoQuality(auto, outputImage, setQuality);

  useEffect(() => {
    const tick = () => {
      if (area.w > 0 && area.h > 0) {
        enqueue(area, viewport.scale);
      }
    };

    const interval = isDesktop ? 333 : 1000;
    const t = setInterval(tick, interval);
    return () => clearInterval(t);
  }, [area, enqueue, viewport.scale, isDesktop]);

  const loading = items.filter((i) => i.status === 'firing').length;

  usePinchZoom(containerRef, viewport, setViewport);
  useDragPan(containerRef, viewport, setViewport);

  useMoveSender(cursorPos, isDesktop);
  useDesktopMouseEvents(containerRef, viewport, screenSize, setCursorPos, isDesktop);

  return (
    <div ref={containerRef} className="screen-Screen">
      {images.length === 0 && (
        <div className="loading-overlay">Loading remote screen...</div>
      )}

      <div
        className="screen-border"
        style={{
          left: `${viewport.u - 2}px`,
          top: `${viewport.v - 2}px`,
          width: `${screenSize.width * viewport.scale}px`,
          height: `${screenSize.height * viewport.scale}px`,
        }}
      />

      {images.map((img, index) => (
        <img
          key={index}
          src={img.url}
          alt={`Remote Screen ${index}`}
          className="image"
          style={{
            left: `${img.area.x * viewport.scale + viewport.u}px`,
            top: `${img.area.y * viewport.scale + viewport.v}px`,
            width: `${img.area.w * viewport.scale}px`,
            height: `${img.area.h * viewport.scale}px`,
          }}
        />
      ))}

      {isDesktop && <DesktopMouse cursorPos={cursorPos} viewport={viewport} />}

      <RefreshButton
        fire={() => fire(area, viewport.scale)}
        area={area}
        loading={loading}
        quality={quality}
        setQuality={setQuality}
        auto={auto}
        setAuto={setAuto}
      />
      <ZoomOutButton screenSize={screenSize} setViewport={setViewport} />
    </div>
  );
};
