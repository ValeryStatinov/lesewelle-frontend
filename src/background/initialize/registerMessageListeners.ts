import {
  type ApiErrorResponseMessage,
  type ExtensionMessage,
  isAddWordPOSToSetMessage,
  isAnalyzeTextDeMessage,
  isDeleteWordPOSFromSetMessage,
  isGetWordsSetsMessage,
  isGetWordsSetWordsMessage,
  isTrackAnalyticsMessage,
  isTranslateTextPortName,
  isWordsLookupMessage,
  PortNameType,
} from 'core/chromeMessages/messages';
import { handleAddWordPOSToSet } from 'background/messageHandlers/handleAddWordPOSToSet';
import { handleAnalyzeTextDe } from 'background/messageHandlers/handleAnalyzeTextDe';
import { handleDeleteWordPOSFromSet } from 'background/messageHandlers/handleDeleteWordPOSFromSet';
import { handleGetWordsSets } from 'background/messageHandlers/handleGetWordsSets';
import { handleGetWordsSetWords } from 'background/messageHandlers/handleGetWordsSetWords';
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

    if (isGetWordsSetsMessage(message)) {
      void handleGetWordsSets(message, sender, sendResponse);

      return true;
    }

    if (isGetWordsSetWordsMessage(message)) {
      void handleGetWordsSetWords(message, sender, sendResponse);

      return true;
    }

    if (isAddWordPOSToSetMessage(message)) {
      void handleAddWordPOSToSet(message, sender, sendResponse);

      return true;
    }

    if (isDeleteWordPOSFromSetMessage(message)) {
      void handleDeleteWordPOSFromSet(message, sender, sendResponse);

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
