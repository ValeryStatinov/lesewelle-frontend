import {
  type ApiErrorResponseMessage,
  type ExtensionMessage,
  isAnalyzeTextDeMessage,
  isTrackAnalyticsMessage,
  isTranslateTextPortName,
  isWordsLookupMessage,
  PortNameType,
} from 'core/chromeMessages/messages';
import { handleAnalyzeTextDe } from 'background/messageHandlers/handleAnalyzeTextDe';
import { handleTrackAnalytics } from 'background/messageHandlers/handleTrackAnalytics';
import { handleTranslateTextStream } from 'background/messageHandlers/handleTranslateTextStream';
import { handleWordsLookup } from 'background/messageHandlers/handleWordsLookup';

export const registerMessageListeners = () => {
  chrome.runtime.onMessage.addListener((message: ExtensionMessage, sender, sendResponse) => {
    if (isAnalyzeTextDeMessage(message)) {
      void handleAnalyzeTextDe(message, sender, sendResponse);

      return true;
    }

    if (isTrackAnalyticsMessage(message)) {
      void handleTrackAnalytics(message, sender, sendResponse);

      return true;
    }

    if (isWordsLookupMessage(message)) {
      void handleWordsLookup(message, sender, sendResponse);

      return true;
    }

    const responseMessage: ApiErrorResponseMessage = {
      error: {
        name: 'UnknownMessage',
        message: `Unknown message: ${message.type}`,
      },
    };
    sendResponse(responseMessage);
    return true;
  });

  chrome.runtime.onConnect.addListener((port) => {
    if (isTranslateTextPortName(port.name as PortNameType)) {
      handleTranslateTextStream({ port });

      return;
    }

    console.error('Unknown port name', port);
  });
};
