import { useState } from 'react';
import { MdClose, MdKeyboardCommandKey } from 'react-icons/md';
import { DraggableButton } from '../screen/DraggableButton';
import './KeyButton.css';
import { KeyMenu } from './KeyMenu';

export const KeyButton = () => {
  const [active, setActive] = useState(false);
  const [text, setText] = useState('ENTER');
  const [history, setHistory] = useState<string[]>([]);

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
