import { useEffect, useState } from 'react';
import { useSnapshot } from 'valtio';

import {
  ExtensionMessageType,
  PortNameType,
  type StreamingDoneMessage,
  type TranslateTextStreamMessage,
} from 'core/chromeMessages/messages';
import type { TranslateTextResponseChunk } from 'core/lib/apiClient';
import { appState } from 'core/lib/state/appState';

type Params = {
  originalText: string;
  enabled: boolean;
};

export const useTranslatedTextExt = (params: Params) => {
  const { originalText, enabled } = params;

  const [translatedText, setTranslatedText] = useState<string>('');
  const [translationError, setTranslationError] = useState<string | undefined>(undefined);
  const [streamInProgress, setStreamInProgress] = useState(false);

  const { targetTranslationLanguage } = useSnapshot(appState);

  useEffect(() => {
    setTranslatedText('');
    setTranslationError(undefined);

    if (!originalText || !enabled) {
      return;
    }

    setStreamInProgress(true);
    const port = chrome.runtime.connect({ name: PortNameType.TRANSLATE_TEXT });

    const message: TranslateTextStreamMessage = {
      type: ExtensionMessageType.TRANSLATE_TEXT_STREAM,
      payload: {
        text: originalText,
        targetLanguage: targetTranslationLanguage,
      },
    };

    port.postMessage(message);

    port.onMessage.addListener((message: TranslateTextResponseChunk | StreamingDoneMessage) => {
      if ('done' in message) {
        port.disconnect();
        setStreamInProgress(false);

        return;
      }

      if ('error' in message) {
        setTranslationError(message.error);
        port.disconnect();
        setStreamInProgress(false);

        return;
      }

      setTranslatedText((prev) => prev + message.delta);
    });

    return () => {
      port.disconnect();
    };
  }, [enabled, originalText, targetTranslationLanguage]);

  return { translatedText, translationError, isLoading: streamInProgress && !translatedText };
};
