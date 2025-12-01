import { type ActivateExtensionWidgetMessage, ExtensionMessageType } from 'core/chromeMessages/messages';
import { initAmplitude, trackExtensionActivated, trackExtensionInstalled } from 'core/lib/amplitude/amplitude';
import { getDeviceId } from 'core/lib/apiClient';

import { initApiClient } from './initApiClient';
import { registerMessageListeners } from './registerMessageListeners';

export const initialize = async () => {
  initApiClient();
  registerMessageListeners();

  chrome.runtime.onInstalled.addListener((details) => {
    trackExtensionInstalled(details.reason);
  });

  chrome.commands.onCommand.addListener((command) => {
    if (command === 'reload-extension') {
      chrome.runtime.reload();
    }
  });

  chrome.action.onClicked.addListener((tab) => {
    if (!tab.id) {
      return;
    }

    const message: ActivateExtensionWidgetMessage = {
      type: ExtensionMessageType.ACTIVATE_EXTENSION_WIDGET,
    };

    void chrome.tabs.sendMessage(tab.id, message);
    trackExtensionActivated();
  });

  let deviceId = 'Not initialized';
  try {
    deviceId = await getDeviceId();
  } catch (error) {
    console.error('Error getting device id', error);
    deviceId = 'Not set due to error';
  }
  const amplitudeApiKey = import.meta.env.VITE_AMPLITUDE_API_KEY;
  const appVersion = EXT_VERSION;

  await initAmplitude(amplitudeApiKey, deviceId, appVersion, 'extension');
};
