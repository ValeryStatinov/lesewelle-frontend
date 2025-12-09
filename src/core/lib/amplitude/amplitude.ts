import { init, setDeviceId, track } from '@amplitude/analytics-browser';
import type { EventOptions } from '@amplitude/analytics-browser/lib/esm/types';

import type { TargetLanguage } from 'core/lib/types/languages';

import { AnalyticsEvents } from './events';
import { hashId } from './hashId';

type PlatformType = 'extension' | 'frontend';

type EventQueueItem = {
  event: string;
  properties?: Record<string, unknown>;
  options?: Omit<EventOptions, 'device_id' | 'app_version' | 'platform'>;
};

let _initialized = false;
let _appVersion: string = 'development';
let _platform: PlatformType;

const eventsQueue: EventQueueItem[] = [];

const isAmplitudeInitialized = () => {
  return _initialized;
};

// should only be used in background script, in handleTrackAnalytics callback
export const trackEvent = (
  event: string,
  properties?: Record<string, unknown>,
  options?: Omit<EventOptions, 'device_id' | 'app_version' | 'platform'>,
) => {
  if (!isAmplitudeInitialized()) {
    eventsQueue.push({ event, properties, options });

    return;
  }

  const eventOptions: EventOptions = {
    ...options,
    app_version: _appVersion,
    platform: _platform,
  };

  track(event, properties, eventOptions);
};

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

  const hashedDeviceId = await hashId(deviceId);

  setDeviceId(hashedDeviceId);

  for (const item of eventsQueue) {
    trackEvent(item.event, item.properties, item.options);
  }
};

export const trackExtensionInstalled = (reason: string) => {
  trackEvent(AnalyticsEvents.EXTENSION_INSTALLED, { reason });
};

export const trackExtensionActivated = () => {
  trackEvent(AnalyticsEvents.EXTENSION_ACTIVATED);
};

export const trackTranslateText = (textLength: number, targetLanguage: TargetLanguage) => {
  trackEvent(AnalyticsEvents.TRANSLATE_TEXT, { textLength, targetLanguage });
};

export const trackAnalyzeDeText = (textLength: number) => {
  trackEvent(AnalyticsEvents.ANALYZE_DE_TEXT, { textLength });
};

export const trackTranslateWord = (wordLength: number, targetLanguage: TargetLanguage) => {
  trackEvent(AnalyticsEvents.TRANSLATE_WORD, { wordLength, targetLanguage });
};
