import { init, setDeviceId, track } from '@amplitude/analytics-browser';

const amp = () => {
  console.log('INITIALIZING AMPLITUDE', import.meta.env.VITE_AMPLITUDE_API_KEY);
  init(import.meta.env.VITE_AMPLITUDE_API_KEY, {
    serverZone: 'EU',
    autocapture: false,
  });

  setDeviceId('background-script-device-id');

  track('background-script-loaded');
};

export const runBackgroundScript = () => {
  amp();

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(sender);

    if ((message as { type: string }).type === 'GET_TEXT') {
      setTimeout(() => {
        sendResponse({ text: (message as { payload: string }).payload + 'from background' });
      }, 1000);
    }

    return true; // Keep the message channel open for async sendResponse
  });
};

runBackgroundScript();

chrome.commands.onCommand.addListener((command) => {
  if (command === 'reload-extension') {
    chrome.runtime.reload();
  }
});
