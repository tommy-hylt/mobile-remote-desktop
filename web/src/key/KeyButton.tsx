import { useEffect, useState } from 'react';
import { MdClose, MdKeyboardCommandKey } from 'react-icons/md';
import { DraggableButton } from '../screen/DraggableButton';
import './KeyButton.css';
import { KeyMenu } from './KeyMenu';
import { useKeySender } from './useKeySender';

interface KeyButtonProps {
  isDesktop?: boolean;
}

export const KeyButton = ({ isDesktop }: KeyButtonProps) => {
  const [active, setActive] = useState(false);
  const [text, setText] = useState('ENTER');
  const [history, setHistory] = useState<string[]>([]);
  const { send } = useKeySender();

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
      // Prevent default for some keys like Tab, Alt, etc. to avoid losing focus
      if (['Tab', 'Alt', 'Control', 'Shift', 'Meta'].includes(e.key) || e.key.startsWith('Arrow')) {
        // e.preventDefault(); // Don't prevent default for now as it might block browser shortcuts
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
