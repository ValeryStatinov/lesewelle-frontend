import type { AnalyzeTextDeMessage } from 'core/chromeMessages/messages';
import { type AnalyzeDeParams, apiAnalyzeDe } from 'core/lib/apiClient';

import { apiErrorHandler } from './apiErrorHandler';
import type { ExtensionMessageHandler } from './types';

export const handleAnalyzeTextDe: ExtensionMessageHandler<AnalyzeTextDeMessage> = async (
  message,
  _sender,
  sendResponse,
) => {
  try {
    const p: AnalyzeDeParams = {
      text: message.payload.text,
    };
    const response = await apiAnalyzeDe(p);
    sendResponse(response);
  } catch (error) {
    apiErrorHandler(error, sendResponse);
  }
};
