import type { TranslateWordMessage } from 'core/chromeMessages/messages';
import { apiTranslateWord, type TranslateWordParams } from 'core/lib/apiClient';

import { apiErrorHandler } from './apiErrorHandler';
import type { ExtensionMessageHandler } from './types';

export const handleTranslateWord: ExtensionMessageHandler<TranslateWordMessage> = async (
  message,
  sender,
  sendResponse,
) => {
  try {
    const p: TranslateWordParams = {
      word: message.payload.word,
    };
    const response = await apiTranslateWord(p);

    sendResponse(response);
  } catch (error) {
    apiErrorHandler(error, sendResponse);
  }
};
