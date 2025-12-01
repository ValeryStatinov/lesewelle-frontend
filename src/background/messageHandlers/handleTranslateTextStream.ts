import {
  type ExtensionMessage,
  isTranslateTextStreamMessage,
  streamingDoneMessage,
} from 'core/chromeMessages/messages';
import { trackTranslateText } from 'core/lib/amplitude/amplitude';
import { apiTranslateTextStream, ResponseErrorJSON, type TranslateTextErrorChunk } from 'core/lib/apiClient';
import { SOMETHING_WENT_WRONG } from 'core/lib/utils/consts';

type Params = {
  port: chrome.runtime.Port;
};

/**
 * sends either TranslateTextDeltaChunk or TranslateTextErrorChunk or StreamingDoneMessage to the port
 */
export const handleTranslateTextStream = (params: Params) => {
  const { port } = params;
  const abortController = new AbortController();

  port.onDisconnect.addListener(() => {
    abortController.abort();
  });

  port.onMessage.addListener(async (message: ExtensionMessage) => {
    if (!isTranslateTextStreamMessage(message)) {
      console.error('Unexpected message', message);

      return;
    }

    try {
      trackTranslateText(message.payload.text.length, message.payload.targetLanguage);

      const reader = await apiTranslateTextStream({
        text: message.payload.text,
        targetLanguage: message.payload.targetLanguage,
        signal: abortController.signal,
      });

      while (!reader.done && !abortController.signal.aborted) {
        const chunk = await reader.nextJson();

        if (chunk.done) {
          port.postMessage(streamingDoneMessage);

          continue;
        }

        port.postMessage(chunk.value);
      }

      port.disconnect();
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return;
        }

        const message: TranslateTextErrorChunk = { error: error.message };
        port.postMessage(message);

        if (error instanceof ResponseErrorJSON && error.code >= 500) {
          console.error('Server error during translation', error);

          return;
        }

        console.error('Unknown error during translation', error);
        return;
      }

      console.error('Unknown error during translation', error);
      const message: TranslateTextErrorChunk = { error: SOMETHING_WENT_WRONG };
      port.postMessage(message);
    }
  });
};
