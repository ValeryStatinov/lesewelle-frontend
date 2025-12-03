import { type ActivateExtensionWidgetMessage, ExtensionMessageType } from 'core/chromeMessages/messages';
import { initAmplitude, trackExtensionActivated, trackExtensionInstalled } from 'core/lib/amplitude/amplitude';
import { getDeviceId } from 'core/lib/apiClient';

import { initApiClient } from './initApiClient';
import { registerMessageListeners } from './registerMessageListeners';

const CONTEXT_MENU_ID = 'lesewelle-translate';

export const initialize = async () => {
  initApiClient();
  registerMessageListeners();

  chrome.runtime.onInstalled.addListener((details) => {
    trackExtensionInstalled(details.reason);

    chrome.contextMenus.create({
      id: CONTEXT_MENU_ID,
      title: 'Translate selection with Lesewelle',
      contexts: ['selection'], // show only when text is selected
    });
  });

  chrome.commands.onCommand.addListener((command) => {
    if (command === 'reload-extension') {
      chrome.runtime.reload();
    }
  });

  const activateWidget = async (tab: chrome.tabs.Tab | undefined) => {
    if (!tab || !tab.id) {
      return;
    }

    trackExtensionActivated();
    const message: ActivateExtensionWidgetMessage = {
      type: ExtensionMessageType.ACTIVATE_EXTENSION_WIDGET,
    };

    void chrome.tabs.sendMessage(tab.id, message);
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js'],
    });
  };

  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId !== CONTEXT_MENU_ID) {
      return;
    }

    await activateWidget(tab);
  });

  chrome.action.onClicked.addListener(async (tab) => {
    await activateWidget(tab);
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
