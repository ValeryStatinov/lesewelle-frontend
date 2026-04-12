import type { GetWordsSetsMessage } from 'core/chromeMessages/messages';
import { apiGetWordsSets } from 'core/lib/apiClient/endpoints/sets';

import { apiErrorHandler } from './apiErrorHandler';
import type { ExtensionMessageHandler } from './types';

export const handleGetWordsSets: ExtensionMessageHandler<GetWordsSetsMessage> = async (
  message,
  sender,
  sendResponse,
) => {
  try {
    const response = await apiGetWordsSets({
      paginator: message.payload.paginator,
    });

    sendResponse(response);
  } catch (error) {
    apiErrorHandler(error, sendResponse);
  }
};
