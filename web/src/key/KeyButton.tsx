import { useEffect, useState } from 'react';
import { MdClose, MdKeyboardCommandKey } from 'react-icons/md';
import { DraggableButton } from '../screen/DraggableButton';
import './KeyButton.css';
import { KeyMenu } from './KeyMenu';
import { useKeySender } from './useKeySender';

interface KeyButtonProps {
  isDesktop?: boolean;
  sendCommand: (method: string, params?: Record<string, unknown>) => boolean;
}

export const KeyButton = ({ isDesktop, sendCommand }: KeyButtonProps) => {
  const [active, setActive] = useState(false);
  const [text, setText] = useState('ENTER');
  const [history, setHistory] = useState<string[]>([]);
  const { send } = useKeySender(sendCommand);

  useEffect(() => {
    if (!isDesktop) return;

    const mapKey = (key: string) => {
      const lower = key.toLowerCase();
      if (lower === '.') return 'period';
      if (lower === ' ') return 'space';
      if (lower === 'control') return 'ctrl';
      if (lower === 'altgraph') return 'alt';
      if (lower === 'meta') return 'win';
      if (lower === 'arrowup') return 'up';
      if (lower === 'arrowdown') return 'down';
      if (lower === 'arrowleft') return 'left';
      if (lower === 'arrowright') return 'right';
      if (lower === 'escape') return 'esc';
      return lower;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      send(mapKey(e.key), 'down');
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      send(mapKey(e.key), 'up');
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isDesktop, send]);

  return (
    <DraggableButton
      className="key-KeyButton"
      onClick={() => setActive(!active)}
      initialX={window.innerWidth - 64}
      initialY={window.innerHeight - 144}
      menu={
        active && (
          <KeyMenu
            text={text}
            setText={setText}
            history={history}
            setHistory={setHistory}
            sendCommand={sendCommand}
          />
        )
      }
    >
      <div className="icon-container">
        {active ? <MdClose size={24} /> : <MdKeyboardCommandKey size={24} />}
      </div>
    </DraggableButton>
  );
};
