import { useState } from 'react';

export const useTextSender = (onComplete: () => void) => {
  const [isSending, setIsSending] = useState(false);

  const sendText = async (text: string) => {
    setIsSending(true);

    try {
      await fetch(`/text/${encodeURIComponent(text)}`, {
        method: 'POST',
      });
    } catch (e) {
      console.error('Failed to send text', e);
    } finally {
      setIsSending(false);
      onComplete();
    }
  };

  return { isSending, sendText };
};
