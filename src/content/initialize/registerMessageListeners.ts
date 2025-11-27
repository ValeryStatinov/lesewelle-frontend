import { type ExtensionMessage, isActivateExtensionWidgetMessage } from 'core/chromeMessages/messages';
import { setIsWidgetActive } from 'core/lib/state/appState';

export const registerMessageListeners = () => {
  chrome.runtime.onMessage.addListener((message: ExtensionMessage) => {
    if (isActivateExtensionWidgetMessage(message)) {
      setIsWidgetActive(true);
    }
  });
};
