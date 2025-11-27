import { setIsTextTranslationEnabled, setTargetTranslationLanguage } from 'core/lib/state/appState';
import type { TargetLanguage } from 'core/lib/types/languages';
import { persistenceManager } from 'background/persistence/persistenceManager';

import { TARGET_TRANSLATION_LANGUAGE_KEY, TRANSLATION_ENABLED_KEY } from './consts';

export const setIsTextTranslationEnabledWithPersistence = (isTextTranslationEnabled: boolean) => {
  setIsTextTranslationEnabled(isTextTranslationEnabled);
  void persistenceManager.setItem(TRANSLATION_ENABLED_KEY, isTextTranslationEnabled);
};

export const setTargetLangueageWithPersistence = (targetLanguage: TargetLanguage) => {
  setTargetTranslationLanguage(targetLanguage);
  void persistenceManager.setItem(TARGET_TRANSLATION_LANGUAGE_KEY, targetLanguage);
};
