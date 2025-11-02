import { useEffect } from 'react';
import { init, setDeviceId, track } from '@amplitude/analytics-browser';

export const App = () => {
  useEffect(() => {
    console.log('INITIALIZING AMPLITUDE');
    init(import.meta.env.VITE_AMPLITUDE_API_KEY, {
      serverZone: 'EU',
      autocapture: false,
    });

    setDeviceId('content-script-device-id');

    track('content-script-loaded', { extra: 'extra-property', extra2: { extraNested: 123 } });
  }, []);

  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();

      const text = selection?.toString();
      if (!text) return;

      chrome.runtime.sendMessage({ type: 'GET_TEXT', payload: text }, (response) => {
        console.log('RESPONSE', response);
      });
    };

    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return null;
};
