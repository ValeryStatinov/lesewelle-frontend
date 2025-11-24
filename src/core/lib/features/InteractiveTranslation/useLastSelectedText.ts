import { useEffect, useRef, useState } from 'react';

const getSelectionText = () => {
  const selection = window.getSelection();
  return selection ? selection.toString().trim() : '';
};

type Params = {
  onChangeText?: (text: string) => void;
};

export const useLastSelectedText = (params: Params) => {
  const { onChangeText } = params;

  const [selectedText, setSelectedText] = useState('');
  const firstRenderRef = useRef(true);

  useEffect(() => {
    const handleMouseUp = () => {
      const text = getSelectionText();
      if (!text || text === selectedText) {
        return;
      }

      setSelectedText(text);
      onChangeText?.(text);
    };

    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      handleMouseUp();
    }

    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onChangeText, selectedText]);

  return { selectedText };
};
