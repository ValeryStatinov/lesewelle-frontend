import { setIsTextTranslationEnabled, setTargetTranslationLanguage } from 'core/lib/state/appState';
import { TargetLanguage } from 'core/lib/types/languages';
import { persistenceManager } from 'background/persistence/persistenceManager';

import { TARGET_TRANSLATION_LANGUAGE_KEY, TRANSLATION_ENABLED_KEY } from './consts';

export const initAppState = async () => {
  const promises: [Promise<boolean | undefined>, Promise<TargetLanguage | undefined>] = [
    persistenceManager.getItem<boolean>(TRANSLATION_ENABLED_KEY),
    persistenceManager.getItem<TargetLanguage>(TARGET_TRANSLATION_LANGUAGE_KEY),
  ];
  const [isTextTranslationEnabled, targetTranslationLanguage] = await Promise.all(promises);

  setIsTextTranslationEnabled(isTextTranslationEnabled ?? true);
  setTargetTranslationLanguage(targetTranslationLanguage ?? TargetLanguage.ENGLISH);
};
