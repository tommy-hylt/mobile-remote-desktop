import { useState } from 'react';
import { MdClose, MdKeyboard } from 'react-icons/md';
import { DraggableButton } from '../screen/DraggableButton';
import './TextButton.css';
import { TextMenu } from './TextMenu';

interface TextButtonProps {
  sendCommand: (method: string, params?: Record<string, unknown>) => boolean;
}

export const TextButton = ({ sendCommand }: TextButtonProps) => {
  const [active, setActive] = useState(false);

  return (
    <>
      <DraggableButton
        className="text-TextButton"
        onClick={() => setActive(!active)}
        initialX={window.innerWidth - 64}
        initialY={window.innerHeight - 80}
        menu={
          active && (
            <TextMenu onClose={() => setActive(false)} sendCommand={sendCommand} />
          )
        }
      >
        <div className="icon-container">
          {active ? <MdClose size={24} /> : <MdKeyboard size={24} />}
        </div>
      </DraggableButton>
    </>
  );
};
