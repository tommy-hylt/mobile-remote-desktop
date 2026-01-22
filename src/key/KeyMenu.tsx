import { useState } from 'react';
import { MdPlayArrow } from 'react-icons/md';
import './KeyMenu.css';
import { useKeySender } from './useKeySender';

export const KeyMenu = () => {
  const [keys, setKeys] = useState('CTRL + C');
  const [history, setHistory] = useState<string[]>([]);
  const { sendDown, sendUp } = useKeySender();

  const addToHistory = (k: string) => {
    setHistory((prev) => {
      const newHistory = [k, ...prev.filter((item) => item !== k)].slice(0, 5);
      return newHistory;
    });
  };

  const handleDown = () => {
    sendDown(keys);
    addToHistory(keys);
  };

  const handleUp = () => {
    sendUp();
  };

  return (
    <div className="key-KeyMenu">
      {history.length > 0 && (
        <>
          <div className="history">
            {history.map((item) => (
              <div
                key={item}
                className="history-item"
                onClick={() => setKeys(item)}
              >
                {item}
              </div>
            ))}
          </div>
        </>
      )}

      <div className="input-row">
        <input
          value={keys}
          onChange={(e) => setKeys(e.target.value)}
          placeholder="e.g. CTRL + C"
        />
        <button
          className="key-trigger"
          onPointerDown={handleDown}
          onPointerUp={handleUp}
          onPointerLeave={handleUp}
          onPointerCancel={handleUp}
        >
          <MdPlayArrow size={24} />
        </button>
      </div>
    </div>
  );
};
