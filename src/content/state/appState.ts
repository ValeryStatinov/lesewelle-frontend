import { persistenceManager } from 'background/persistence/persistenceManager';
import { proxy } from 'valtio';

const TRANSLATION_ENABLED_KEY = 'translationEnabled';

export const appState = proxy({
  isWidgetActive: import.meta.env.MODE === 'development' ? true : false,
  isTextTranslationEnabled: true,
});

export const initAppState = async () => {
  const promises: [Promise<boolean | undefined>] = [persistenceManager.getItem<boolean>(TRANSLATION_ENABLED_KEY)];

  const [isTextTranslationEnabled] = await Promise.all(promises);
  appState.isTextTranslationEnabled = isTextTranslationEnabled ?? true;
};

export const setIsWidgetActive = (isWidgetActive: boolean) => {
  appState.isWidgetActive = isWidgetActive;
};

export const setIsTextTranslationEnabled = (isTextTranslationEnabled: boolean) => {
  appState.isTextTranslationEnabled = isTextTranslationEnabled;
  void persistenceManager.setItem(TRANSLATION_ENABLED_KEY, isTextTranslationEnabled);
};
