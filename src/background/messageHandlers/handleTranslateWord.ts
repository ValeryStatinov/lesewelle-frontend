import type { TranslateWordMessage } from 'core/chromeMessages/messages';
import { trackTranslateWord } from 'core/lib/amplitude/amplitude';
import { apiTranslateWord, type TranslateWordParams } from 'core/lib/apiClient';

import { apiErrorHandler } from './apiErrorHandler';
import type { ExtensionMessageHandler } from './types';

export const handleTranslateWord: ExtensionMessageHandler<TranslateWordMessage> = async (
  message,
  sender,
  sendResponse,
) => {
  try {
    trackTranslateWord(message.payload.word.length, message.payload.targetLanguage);

    const p: TranslateWordParams = {
      word: message.payload.word,
      targetLanguage: message.payload.targetLanguage,
    };
    const response = await apiTranslateWord(p);

    sendResponse(response);
  } catch (error) {
    apiErrorHandler(error, sendResponse);
  }
};
