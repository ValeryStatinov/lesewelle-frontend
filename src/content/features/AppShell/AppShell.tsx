import { useEffect, useRef } from 'react';
import { useSnapshot } from 'valtio';

import { sendAnalyzeTextDeMessage, sendTranslateWordMessage } from 'core/chromeMessages/messages';
import { InteractiveTranslation } from 'core/lib/features/InteractiveTranslation/InteractiveTranslation';
import { useTranslatedTextExt } from 'core/lib/features/InteractiveTranslation/useTranslatedTextExt';
import { createLoadWordTranslationsHook } from 'core/lib/features/WordTranslation/useLoadWordTranslations';
import { AnimatedWordTranslationBottomSheet } from 'core/lib/features/WordTranslation/WordTranslationBottomSheet';
import { appState } from 'core/lib/state/appState';
import {
  interactiveTranslationState,
  resetInteractiveTranslationState,
  setSelectedRootToken,
} from 'core/lib/state/interactiveTranslationState';
import { noop } from 'core/lib/utils/noop';
import { useEventCallback } from 'core/lib/utils/useEventCallback';
import { AnimatedDictionaryScreen } from 'content/features/DictionaryScreen/DictionaryScreen';
import { AnimatedSettingsScreen } from 'content/features/Settings/SettingsScreen';
import { setIsTextTranslationEnabledWithPersistence, setTargetLangueageWithPersistence } from 'content/state/appState';
import {
  addToDictionary,
  dictionaryState,
  setSelectedLemma,
  useDictionarySnapshot,
  useWordTranslationsDictionary,
} from 'content/state/dictionaryState';

import { Header } from './Header';
import { useDraggableWidget } from './useDraggableWidget';

const { useLoadWordTranslations } = createLoadWordTranslationsHook(sendTranslateWordMessage);

export const AppShell = () => {
  const dragHandleRef = useRef<HTMLButtonElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { isWidgetActive, isTextTranslationEnabled } = useSnapshot(appState);
  const { selectedRootToken } = useSnapshot(interactiveTranslationState);
  const { selectedLemma } = useSnapshot(dictionaryState);

  useDraggableWidget({
    dragHandleRef,
    draggableElementRef: containerRef,
    isWidgetActive,
  });

  const handleCloseLoadedWordTranslations = useEventCallback(() => {
    setSelectedRootToken(undefined);
  });

  const handleCloseDictionaryWordTranslations = useEventCallback(() => {
    setSelectedLemma(undefined);
  });

  const handleDictionaryEntryClick = useEventCallback((lemma: string) => {
    setSelectedLemma(lemma);
  });

  useEffect(() => {
    if (isWidgetActive) {
      return;
    }

    resetInteractiveTranslationState();
  }, [isWidgetActive]);

  if (!isWidgetActive) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`
        fixed top-0 left-0 z-99999 flex h-125 max-h-screen w-95 flex-col rounded-sm bg-white p-2 text-sm drop-shadow-lg
      `}
    >
      <header>
        <Header dragHandleRef={dragHandleRef} />
      </header>

      <main className='relative mt-2 flex flex-1 flex-col overflow-hidden'>
        <InteractiveTranslation
          analyzeDEText={sendAnalyzeTextDeMessage}
          useTranslatedText={useTranslatedTextExt}
          isTextTranslationEnabled={isTextTranslationEnabled}
        />

        <AnimatedWordTranslationBottomSheet
          show={!!selectedRootToken}
          useDictionary={useDictionarySnapshot}
          useWordTranslations={useLoadWordTranslations}
          onClose={handleCloseLoadedWordTranslations}
          onAddToDictionary={addToDictionary}
        />

        <AnimatedSettingsScreen
          onChangeFullTextTranslationEnabled={setIsTextTranslationEnabledWithPersistence}
          onChangeTargetLanguage={setTargetLangueageWithPersistence}
        />

        <AnimatedDictionaryScreen
          useDictionary={useDictionarySnapshot}
          onDictionaryEntryClick={handleDictionaryEntryClick}
        />

        <AnimatedWordTranslationBottomSheet
          show={!!selectedLemma}
          useDictionary={useDictionarySnapshot}
          useWordTranslations={useWordTranslationsDictionary}
          onClose={handleCloseDictionaryWordTranslations}
          onAddToDictionary={noop}
        />
      </main>
    </div>
  );
};
