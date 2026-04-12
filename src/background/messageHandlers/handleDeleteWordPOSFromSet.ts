import type { DeleteWordPOSFromSetMessage } from 'core/chromeMessages/messages';
import { apiDeleteWordPOSFromSet } from 'core/lib/apiClient/endpoints/sets';

import { apiErrorHandler } from './apiErrorHandler';
import type { ExtensionMessageHandler } from './types';

export const handleDeleteWordPOSFromSet: ExtensionMessageHandler<DeleteWordPOSFromSetMessage> = async (
  message,
  sender,
  sendResponse,
) => {
  try {
    await apiDeleteWordPOSFromSet({
      setId: message.payload.setId,
      wordPOSId: message.payload.wordPOSId,
    });

    sendResponse(undefined);
  } catch (error) {
    apiErrorHandler(error, sendResponse);
  }
};
