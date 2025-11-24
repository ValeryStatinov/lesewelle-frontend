export type ExtensionMessageHandler<T> = (
  message: T,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: unknown) => void,
) => Promise<void>;
