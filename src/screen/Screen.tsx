import { useRef } from 'react';
import type { Rect, ScreenSize } from '../types';
import { useScreenImages } from './useScreenImages';
import { useTouchZoom } from './useTouchZoom';
import './Screen.css';

interface ScreenProps {
  area: Rect;
  screenSize: ScreenSize;
  onAreaChange: (area: Rect) => void;
}

export const Screen = ({ area, screenSize, onAreaChange }: ScreenProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { images, fetchCapture } = useScreenImages(area);

  useTouchZoom(containerRef, area, screenSize, onAreaChange);

  if (images.length === 0) {
    return (
      <div ref={containerRef} className="screen-Screen" onClick={() => fetchCapture()}>
        <p>Loading remote screen...</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="screen-Screen"
      onClick={() => fetchCapture()}
      style={{ overflow: 'hidden', position: 'relative', width: '100vw', height: '100vh' }}
    >
      {images.map((img, index) => {
        const left = ((img.area.x - area.x) / area.w) * 100;
        const top = ((img.area.y - area.y) / area.h) * 100;
        const width = (img.area.w / area.w) * 100;
        const height = (img.area.h / area.h) * 100;

        return (
          <img
            key={index}
            src={img.url}
            alt={`Remote Screen ${index}`}
            className="image"
            style={{
              position: 'absolute',
              left: `${left}%`,
              top: `${top}%`,
              width: `${width}%`,
              height: `${height}%`,
              pointerEvents: 'none',
              objectFit: 'fill',
            }}
          />
        );
      })}
    </div>
  );
};
