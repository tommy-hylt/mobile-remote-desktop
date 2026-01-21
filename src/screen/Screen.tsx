import { useRef, useEffect } from 'react';

import { useCaptureQueue } from './useCaptureQueue';
import { useImageCache } from './useImageCache';
import { useArea } from './useArea';
import { usePinchZoom } from './usePinchZoom';
import { useDragPan } from './useDragPan';
import { RefreshButton } from './RefreshButton';
import { ZoomOutButton } from './ZoomOutButton';
import './Screen.css';
import type { ScreenSize } from './ScreenSize';
import type { ViewportState } from './ViewportState';

export interface ScreenProps {
  viewport: ViewportState;
  screenSize: ScreenSize;
  setViewport: (viewport: ViewportState) => void;
}

export const Screen = ({ viewport, screenSize, setViewport }: ScreenProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { enqueue, fire, outputImage, items } = useCaptureQueue();
  const { images } = useImageCache(outputImage);
  const area = useArea(viewport, screenSize);

  useEffect(() => {
    const tick = () => {
      if (area.w > 0 && area.h > 0) {
        enqueue(area, viewport.scale);
      }
    };

    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [area, enqueue, viewport.scale]);

  const loading = items.filter((i) => i.status === 'firing').length;

  usePinchZoom(containerRef, viewport, setViewport);
  useDragPan(containerRef, viewport, setViewport);

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

      <RefreshButton
        fire={() => fire(area, viewport.scale)}
        area={area}
        loading={loading}
      />
      <ZoomOutButton screenSize={screenSize} setViewport={setViewport} />
    </div>
  );
};
