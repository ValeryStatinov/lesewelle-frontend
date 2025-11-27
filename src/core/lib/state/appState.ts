import { proxy } from 'valtio';

import { TargetLanguage } from '../types/languages';

export const appState = proxy({
  isWidgetActive: import.meta.env.MODE === 'development' ? true : false,
  isTextTranslationEnabled: true,
  targetTranslationLanguage: TargetLanguage.ENGLISH,
});

export const setIsWidgetActive = (isWidgetActive: boolean) => {
  appState.isWidgetActive = isWidgetActive;
};

export const setIsTextTranslationEnabled = (isTextTranslationEnabled: boolean) => {
  appState.isTextTranslationEnabled = isTextTranslationEnabled;
};

export const setTargetTranslationLanguage = (targetTranslationLanguage: TargetLanguage) => {
  appState.targetTranslationLanguage = targetTranslationLanguage;
};
