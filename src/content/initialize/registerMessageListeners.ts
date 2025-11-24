import { setIsWidgetActive } from 'content/state/appState';

import { type ExtensionMessage, isActivateExtensionWidgetMessage } from 'core/chromeMessages/messages';

export const registerMessageListeners = () => {
  chrome.runtime.onMessage.addListener((message: ExtensionMessage) => {
    if (isActivateExtensionWidgetMessage(message)) {
      setIsWidgetActive(true);
    }
  });
};
