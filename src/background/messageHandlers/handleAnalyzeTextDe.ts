import { type AnalyzeDeParams, apiAnalyzeDe } from 'core/lib/apiClient';
import type { AnalyzeTextDeMessage } from 'core/types/messages';

export type ExtensionMessageHandler<T> = (
  message: T,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: unknown) => void,
) => Promise<void>;

export const handleAnalyzeTextDe: ExtensionMessageHandler<AnalyzeTextDeMessage> = async (
  message,
  _sender,
  sendResponse,
) => {
  const p: AnalyzeDeParams = {
    text: message.payload.text,
  };
  const response = await apiAnalyzeDe(p);

  sendResponse(response);
};
