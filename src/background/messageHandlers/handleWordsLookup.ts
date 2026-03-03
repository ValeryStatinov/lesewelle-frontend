import type { WordsLookupMessage } from 'core/chromeMessages/messages';
import { apiWordsLookup, type WordsLookupParams } from 'core/lib/apiClient';

import { apiErrorHandler } from './apiErrorHandler';
import type { ExtensionMessageHandler } from './types';

export const handleWordsLookup: ExtensionMessageHandler<WordsLookupMessage> = async (message, sender, sendResponse) => {
  try {
    // TODO: add tracking event
    // trackTranslateWord(message.payload.word.length, message.payload.targetLanguage);

    const p: WordsLookupParams = {
      word: message.payload.word,
      targetLanguage: message.payload.targetLanguage,
      pos: message.payload.pos,
    };
    const response = await apiWordsLookup(p);

    sendResponse(response);
  } catch (error) {
    apiErrorHandler(error, sendResponse);
  }
};
