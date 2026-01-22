import { useRef, useState } from 'react';

export const useTextSender = (onComplete: () => void) => {
  const [isSending, setIsSending] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendText = async (text: string) => {
    setIsSending(true);
    abortControllerRef.current = new AbortController();

    try {
      for (const char of text) {
        if (abortControllerRef.current.signal.aborted) break;

        await fetch('/key', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: char }),
        });

        // Small delay to ensure order and not overwhelm server/receiver
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
    } catch (e) {
      console.error('Failed to send text', e);
    } finally {
      setIsSending(false);
      abortControllerRef.current = null;
      onComplete();
    }
  };

  return { isSending, sendText };
};
