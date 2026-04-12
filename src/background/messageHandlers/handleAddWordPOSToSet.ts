import type { AddWordPOSToSetMessage } from 'core/chromeMessages/messages';
import { apiAddWordPOSToSet } from 'core/lib/apiClient/endpoints/sets';

import { apiErrorHandler } from './apiErrorHandler';
import type { ExtensionMessageHandler } from './types';

export const handleAddWordPOSToSet: ExtensionMessageHandler<AddWordPOSToSetMessage> = async (
  message,
  sender,
  sendResponse,
) => {
  try {
    await apiAddWordPOSToSet({
      setId: message.payload.setId,
      wordPOSId: message.payload.wordPOSId,
    });

    sendResponse(undefined);
  } catch (error) {
    apiErrorHandler(error, sendResponse);
  }
};
