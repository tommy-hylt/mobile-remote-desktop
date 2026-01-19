import { useState, useEffect } from 'react';
import './App.css';
import { Screen } from './screen/Screen';
import type { Rect, ScreenSize } from './types';

function App() {
  const [screenSize, setScreenSize] = useState<ScreenSize | null>(null);
  const [area, setArea] = useState<Rect | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch('/screen-size');
        if (response.ok) {
          const size = await response.json();
          setScreenSize(size);
          setArea({ x: 0, y: 0, w: size.width, h: size.height });
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <div className="App">
      {area && screenSize ? (
        <Screen area={area} screenSize={screenSize} onAreaChange={setArea} />
      ) : (
        <div className="loading">Connecting to remote desktop...</div>
      )}
    </div>
  );
}

export default App;
