export const useKeySender = () => {
  const parseKeys = (keyString: string): string[] => {
    return keyString
      .split(/[ +]+/)
      .map((k) => k.trim().toLowerCase())
      .filter((k) => k.length > 0);
  };

  const sendDown = async (keyString: string) => {
    const keys = parseKeys(keyString);
    try {
      for (const key of keys) {
        await fetch(`/key/${encodeURIComponent(key)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: '{}',
        });
      }
    } catch (e) {
      console.error('Failed to send key', e);
    }
  };

  const sendUp = async () => {
    // no-op
  };

  return { sendDown, sendUp };
};
