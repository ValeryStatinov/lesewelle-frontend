import { init, setDeviceId, track } from '@amplitude/analytics-browser';
import type { EventOptions } from '@amplitude/analytics-browser/lib/esm/types';

type PlatformType = 'extension' | 'frontend';

let _initialized = false;
let _appVersion: string = 'development';
let _platform: PlatformType;

export const initAmplitude = async (apiKey: string, deviceId: string, appVersion: string, platform: PlatformType) => {
  const initPromise = init(apiKey, {
    serverZone: 'EU',
    autocapture: false,
  });

  try {
    await initPromise.promise;
  } catch (error) {
    console.error('Error initializing Amplitude', error);
    return;
  }

  _initialized = true;
  _appVersion = appVersion;
  _platform = platform;

  setDeviceId(deviceId);
};

const isAmplitudeInitialized = () => {
  return _initialized;
};

const trackEvent = (
  event: string,
  properties?: Record<string, unknown>,
  options?: Omit<EventOptions, 'device_id' | 'app_version' | 'platform'>,
) => {
  if (!isAmplitudeInitialized()) {
    console.warn('Amplitude not initialized, skipping event tracking');

    return;
  }

  const eventOptions: EventOptions = {
    ...options,
    app_version: _appVersion,
    platform: _platform,
  };

  track(event, properties, eventOptions);
};

export const trackExtensionInstalled = (reason: string) => {
  trackEvent('extension_installed', { reason });
};
