import type { GetWordsSetWordsMessage } from 'core/chromeMessages/messages';
import { apiGetWordsSetWords } from 'core/lib/apiClient/endpoints/sets';

import { apiErrorHandler } from './apiErrorHandler';
import type { ExtensionMessageHandler } from './types';

export const handleGetWordsSetWords: ExtensionMessageHandler<GetWordsSetWordsMessage> = async (
  message,
  sender,
  sendResponse,
) => {
  try {
    const response = await apiGetWordsSetWords({
      setId: message.payload.setId,
      paginator: message.payload.paginator,
      lang: message.payload.lang,
    });

    sendResponse(response);
  } catch (error) {
    apiErrorHandler(error, sendResponse);
  }
};
