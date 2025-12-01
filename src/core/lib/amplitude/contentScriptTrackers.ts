import { sendTrackAnalyticsMessage } from 'core/chromeMessages/messages';
import type { TargetLanguage } from 'core/lib/types/languages';

import { AnalyticsEvents } from './events';

export const trackOpenSettings = () => {
  void sendTrackAnalyticsMessage(AnalyticsEvents.OPEN_SETTINGS);
};

export const trackChangeTargetLanguage = (targetLanguage: TargetLanguage) => {
  void sendTrackAnalyticsMessage(AnalyticsEvents.CHANGE_TARGET_LANGUAGE, { targetLanguage });
};

export const trackChangeFullTextTranslationEnabled = (isFullTextTranslationEnabled: boolean) => {
  void sendTrackAnalyticsMessage(AnalyticsEvents.CHANGE_FULL_TEXT_TRANSLATION_ENABLED, {
    isFullTextTranslationEnabled,
  });
};

export const trackOpenDictionary = () => {
  void sendTrackAnalyticsMessage(AnalyticsEvents.OPEN_DICTIONARY);
};

export const trackAddToDictionary = (wordLength: number, numTranslations: number) => {
  void sendTrackAnalyticsMessage(AnalyticsEvents.ADD_TO_DICTIONARY, { wordLength, numTranslations });
};

export const trackStudyWords = () => {
  void sendTrackAnalyticsMessage(AnalyticsEvents.STUDY_WORDS);
};
