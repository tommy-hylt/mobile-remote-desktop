import { useEffect, useState } from 'react';
import './App.css';
import { KeyButton } from './key/KeyButton';
import { MobileMouse } from './mouse/MobileMouse';
import { Screen } from './screen/Screen';
import type { ScreenSize } from './screen/ScreenSize';
import { useWakeLock } from './screen/useWakeLock';
import type { ViewportState } from './screen/ViewportState';
import { TextButton } from './text/TextButton';
import { useSocket } from './useSocket';

function App() {
  const [screenSize, setScreenSize] = useState<ScreenSize | null>(null);
  const [viewport, setViewport] = useState<ViewportState | null>(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1500);
  const { sendCommand, addListener } = useSocket();

  useWakeLock();

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 1500);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
            isDesktop={isDesktop}
            sendCommand={sendCommand}
            addListener={addListener}
          />
          {!isDesktop && (
            <MobileMouse viewport={viewport} sendCommand={sendCommand} />
          )}
          <TextButton sendCommand={sendCommand} />
          <KeyButton isDesktop={isDesktop} sendCommand={sendCommand} />
        </>
      ) : (
        <div className="loading">Connecting to remote desktop...</div>
      )}
    </div>
  );
}

export default App;