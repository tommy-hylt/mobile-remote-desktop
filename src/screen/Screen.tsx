import { useRef } from 'react';
import type { ScreenSize } from './ScreenSize';
import type { ViewportState } from './ViewportState';
import { useScreenImages } from './useScreenImages';
import { useTouchZoom } from './useTouchZoom';
import { RefreshButton } from './RefreshButton';
import './Screen.css';

interface ScreenProps {
  viewport: ViewportState;
  screenSize: ScreenSize;
  onViewportChange: (viewport: ViewportState) => void;
}

export const Screen = ({ viewport, screenSize, onViewportChange }: ScreenProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { images, fetchCapture } = useScreenImages(viewport, screenSize);

  useTouchZoom(containerRef, viewport, screenSize, onViewportChange);

  return (
    <div ref={containerRef} className="screen-Screen">
      {images.length === 0 && (
        <div className="loading-overlay">
          Loading remote screen...
        </div>
      )}

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

      <RefreshButton onClick={() => fetchCapture()} />
    </div>
  );
};
