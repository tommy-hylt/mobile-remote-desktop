import { useState, useEffect } from 'react';
import './App.css';
import { Screen } from './screen/Screen';
import type { ViewportState } from './screen/ViewportState';
import type { ScreenSize } from './screen/ScreenSize';

function App() {
  const [screenSize, setScreenSize] = useState<ScreenSize | null>(null);
  const [viewport, setViewport] = useState<ViewportState | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch('/screen-size');
        if (response.ok) {
          const size = await response.json();
          setScreenSize(size);
          const scaleW = window.innerWidth / size.width;
          const scaleH = window.innerHeight / size.height;
          const scale = Math.min(scaleW, scaleH);

          setViewport({
            u: (window.innerWidth - size.width * scale) / 2,
            v: 0,
            scale,
          });
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <div className="App">
      {viewport && screenSize ? (
        <Screen viewport={viewport} screenSize={screenSize} onViewportChange={setViewport} />
      ) : (
        <div className="loading">Connecting to remote desktop...</div>
      )}
    </div>
  );
}

export default App;
