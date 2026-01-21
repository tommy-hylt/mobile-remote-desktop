import { useRef } from 'react';
import type { ScreenSize } from './ScreenSize';
import type { ViewportState } from './ViewportState';
import { useScreenImages } from './useScreenImages';
import { usePinchZoom } from './usePinchZoom';
import { useDragPan } from './useDragPan';
import { RefreshButton } from './RefreshButton';
import { ZoomOutButton } from './ZoomOutButton';
import './Screen.css';

interface ScreenProps {
  viewport: ViewportState;
  screenSize: ScreenSize;
  onViewportChange: (viewport: ViewportState) => void;
}

export const Screen = ({ viewport, screenSize, onViewportChange }: ScreenProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { images, fetchCapture, loading } = useScreenImages(viewport, screenSize);

  usePinchZoom(containerRef, viewport, onViewportChange);
  useDragPan(containerRef, viewport, onViewportChange);

  const handleZoomOut = () => {
    const scaleW = window.innerWidth / screenSize.width;
    const scaleH = window.innerHeight / screenSize.height;
    const scale = Math.min(scaleW, scaleH);

    onViewportChange({
      u: (window.innerWidth - screenSize.width * scale) / 2,
      v: 0,
      scale,
    });
  };

  return (
    <div ref={containerRef} className="screen-Screen">
      {images.length === 0 && (
        <div className="loading-overlay">
          Loading remote screen...
        </div>
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

      <RefreshButton onClick={() => fetchCapture()} loading={loading} />
      <ZoomOutButton onClick={handleZoomOut} />
    </div>
  );
};
