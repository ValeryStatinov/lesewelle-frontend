import { handleAnalyzeTextDe } from 'background/messageHandlers/handleAnalyzeTextDe';
import { handleTranslateTextStream } from 'background/messageHandlers/handleTranslateTextStream';
import { handleTranslateWord } from 'background/messageHandlers/handleTranslateWord';

import {
  type ExtensionMessage,
  isAnalyzeTextDeMessage,
  isTranslateTextPortName,
  isTranslateWordMessage,
  PortNameType,
} from 'core/chromeMessages/messages';

export const registerMessageListeners = () => {
  chrome.runtime.onMessage.addListener((message: ExtensionMessage, sender, sendResponse) => {
    if (isAnalyzeTextDeMessage(message)) {
      void handleAnalyzeTextDe(message, sender, sendResponse);

      return true;
    }

    if (isTranslateWordMessage(message)) {
      void handleTranslateWord(message, sender, sendResponse);

      return true;
    }

    console.error('Unknown message', message);
  });

  chrome.runtime.onConnect.addListener((port) => {
    if (isTranslateTextPortName(port.name as PortNameType)) {
      handleTranslateTextStream({ port });

      return;
    }

    console.error('Unknown port name', port);
  });
};
