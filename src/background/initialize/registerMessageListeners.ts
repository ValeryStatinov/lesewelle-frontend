import { handleAnalyzeTextDe } from 'background/messageHandlers/handleAnalyzeTextDe';

import { type ExtensionMessage, isAnalyzeTextDeMessage } from 'core/types/messages';

export const registerMessageListeners = () => {
  chrome.runtime.onMessage.addListener((message: ExtensionMessage, sender, sendResponse) => {
    if (isAnalyzeTextDeMessage(message)) {
      void handleAnalyzeTextDe(message, sender, sendResponse);

      return true;
    }
  });
};
