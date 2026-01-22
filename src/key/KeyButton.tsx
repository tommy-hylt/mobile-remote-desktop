import { useState } from 'react';
import { MdClose, MdKeyboardCommandKey } from 'react-icons/md';
import { DraggableButton } from '../screen/DraggableButton';
import './KeyButton.css';
import { KeyMenu } from './KeyMenu';

export const KeyButton = () => {
  const [active, setActive] = useState(false);

  return (
    <DraggableButton
      className="key-KeyButton"
      onClick={() => setActive(!active)}
      initialX={window.innerWidth - 64}
      initialY={window.innerHeight - 144} // Swapped to top position
      menu={active && <KeyMenu />}
    >
      <div className="icon-container">
        {active ? <MdClose size={24} /> : <MdKeyboardCommandKey size={24} />}
      </div>
    </DraggableButton>
  );
};
