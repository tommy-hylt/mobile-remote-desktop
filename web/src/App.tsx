import { useEffect, useState } from 'react';
import './App.css';
import { KeyButton } from './key/KeyButton';
import { Mouse } from './mouse/Mouse';
import { Screen } from './screen/Screen';
import type { ScreenSize } from './screen/ScreenSize';
import { useWakeLock } from './screen/useWakeLock';
import type { ViewportState } from './screen/ViewportState';
import { TextButton } from './text/TextButton';

function App() {
  const [screenSize, setScreenSize] = useState<ScreenSize | null>(null);
  const [viewport, setViewport] = useState<ViewportState | null>(null);

  useWakeLock();

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
        <>
          <Screen
            viewport={viewport}
            screenSize={screenSize}
            setViewport={setViewport}
          />
          <Mouse viewport={viewport} />
          <TextButton />
          <KeyButton />
        </>
      ) : (
        <div className="loading">Connecting to remote desktop...</div>
      )}
    </div>
  );
}

export default App;
