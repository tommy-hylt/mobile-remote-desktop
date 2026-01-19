import { useState, useEffect } from 'react';
import './Screen.css';

export const Screen = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchCapture = async () => {
      try {
        const response = await fetch('/capture');
        if (response.ok) {
          if (response.status === 204) {
            return;
          }
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setImageUrl(url);
        } else {
          console.error('Failed to fetch capture:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching capture:', error);
      }
    };

    fetchCapture();
  }, []);

  if (!imageUrl) {
    return (
      <div>
        <p>Loading remote screen...</p>
      </div>
    );
  }

  return (
    <div className="screen-Screen">
      <img src={imageUrl} alt="Remote Screen" className="image" />
    </div>
  );
};
