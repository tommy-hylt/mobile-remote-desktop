import { useState } from 'react';

type CommandParams = Record<string, unknown>;

export const useTextSender = (
  onComplete: () => void,
  sendCommand?: (method: string, params?: CommandParams) => boolean
) => {
  const [isSending, setIsSending] = useState(false);

  const sendText = async (text: string) => {
    setIsSending(true);

    const wsMethod = `POST /text/${text}`;
    if (!sendCommand?.(wsMethod)) {
      try {
        await fetch(`/text/${encodeURIComponent(text)}`, {
          method: 'POST',
        });
      } catch (e) {
        console.error('Failed to send text', e);
      }
    }

    setIsSending(false);
    onComplete();
  };

  return { isSending, sendText };
};
