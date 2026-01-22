import { useState } from 'react';
import { MdPlayArrow } from 'react-icons/md';
import './KeyMenu.css';
import { useKeySender } from './useKeySender';

export const KeyMenu = () => {
  const [text, setText] = useState('CTRL + C');
  const [history, setHistory] = useState<string[]>([]);
  const [isPressing, setIsPressing] = useState(false);
  const { send } = useKeySender();

  const handleUp = () => {
    setIsPressing(false);
    send(text, 'up');
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
                onClick={() => !isPressing && setText(item)}
              >
                {item}
              </div>
            ))}
          </div>
        </>
      )}

      <div className="input-row">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. CTRL + C"
          disabled={isPressing}
        />
        <button
          className="key-trigger"
          onPointerDown={() => {
            setIsPressing(true);
            send(text, 'down');
            setHistory((prev) => {
              const k = text;
              return [k, ...prev.filter((item) => item !== k)].slice(0, 5);
            });
          }}
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
