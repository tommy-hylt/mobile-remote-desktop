import { useState } from 'react';
import { MdSend } from 'react-icons/md';
import './TextMenu.css';
import { useTextSender } from './useTextSender';

interface TextMenuProps {
  onClose: () => void;
  sendCommand: (method: string, params?: Record<string, unknown>) => string | null;
}

export const TextMenu = ({ onClose, sendCommand }: TextMenuProps) => {
  const [text, setText] = useState('');
  const { isSending, sendText } = useTextSender(onClose, sendCommand);

  const handleSend = () => {
    if (text) {
      sendText(text);
    } else {
      onClose();
    }
  };

  return (
    <div className="text-TextMenu">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isSending}
        placeholder="Type here..."
        autoFocus
      />
      <button onClick={handleSend} disabled={isSending}>
        <MdSend size={24} />
      </button>
    </div>
  );
};
