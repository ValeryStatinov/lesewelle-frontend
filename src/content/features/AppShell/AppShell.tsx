import { useEffect, useRef } from 'react';
import { useSnapshot } from 'valtio';

import {
  sendAddWordPOSToSetMessage,
  sendAnalyzeTextDeMessage,
  sendDeleteWordPOSFromSetMessage,
  sendGetWordsSetWordsMessage,
  sendWordsLookupMessage,
} from 'core/chromeMessages/messages';
import type { WordPOSWithLemma } from 'core/lib/apiClient/endpoints/types/words';
import { useWordPOSSetActionWithReload } from 'core/lib/features/Dictionary/createDictionaryApiCalls';
import { InteractiveTranslation } from 'core/lib/features/InteractiveTranslation/InteractiveTranslation';
import { useTranslatedTextExt } from 'core/lib/features/InteractiveTranslation/useTranslatedTextExt';
import { createLoadWordsDefinitionsHook } from 'core/lib/features/WordDefinition/useLoadWordsDefinitions';
import { useWordDefinitionFromDictionary } from 'core/lib/features/WordDefinition/useWordDefinitionFromDictionary';
import { AnimatedWordDefinitionBottomSheet } from 'core/lib/features/WordDefinition/WordDefinitionBottomSheet';
import { appState } from 'core/lib/state/appState';
import { dictionaryState, setSelectedDictionaryWordPOS } from 'core/lib/state/dictionaryState';
import {
  interactiveTranslationState,
  resetInteractiveTranslationState,
  setSelectedRootToken,
} from 'core/lib/state/interactiveTranslationState';
import { learningSessionState } from 'core/lib/state/learningSessionState';
import { useEventCallback } from 'core/lib/utils/useEventCallback';
import { loadSets, loadSetWords } from 'content/features/DictionaryScreen/dictionaryApiCalls';
import { AnimatedDictionaryScreen } from 'content/features/DictionaryScreen/DictionaryScreen';
import { AnimatedSettingsScreen } from 'content/features/Settings/SettingsScreen';
import { setIsTextTranslationEnabledWithPersistence, setTargetLangueageWithPersistence } from 'content/state/appState';

import { AnimatedLearningSession } from '../LearnWords/LearningSession';

import { Header } from './Header';
import { useDraggableWidget } from './useDraggableWidget';

const { useLoadWordsDefinitions } = createLoadWordsDefinitionsHook(sendWordsLookupMessage);

export const AppShell = () => {
  const dragHandleRef = useRef<HTMLButtonElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { isWidgetActive, isTextTranslationEnabled } = useSnapshot(appState);
  const { selectedRootToken } = useSnapshot(interactiveTranslationState);
  const dictionarySnapshot = useSnapshot(dictionaryState);
  const learningSessinSnapshot = useSnapshot(learningSessionState);

  const handleAddWordPOSToSet = useWordPOSSetActionWithReload({
    loadSetWords: loadSetWords,
    action: sendAddWordPOSToSetMessage,
  });

  const handleDeleteWordPOSFromSet = useWordPOSSetActionWithReload({
    loadSetWords: loadSetWords,
    action: sendDeleteWordPOSFromSetMessage,
  });

  useEffect(() => {
    const load = async () => {
      await loadSets(dictionarySnapshot.sets.paginator);
    };

    void load();
  }, [dictionarySnapshot.sets.paginator]);

  useDraggableWidget({
    dragHandleRef,
    draggableElementRef: containerRef,
    isWidgetActive,
  });

  const handleCloseLoadedWordDefinition = useEventCallback(() => {
    setSelectedRootToken(undefined);
  });

  const handleCloseDictionaryWordDefinition = useEventCallback(() => {
    setSelectedDictionaryWordPOS(undefined);
  });

  const handleDictionaryEntryClick = useEventCallback((wordPOS: WordPOSWithLemma) => {
    setSelectedDictionaryWordPOS(wordPOS);
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
    <>
      <div
        ref={containerRef}
        className={`
          fixed top-0 left-0 z-99999 flex h-125 max-h-screen w-95 flex-col rounded-sm bg-white p-2 text-sm
          drop-shadow-lg
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

          <AnimatedWordDefinitionBottomSheet
            show={!!selectedRootToken}
            useWordsDefinitions={useLoadWordsDefinitions}
            onClose={handleCloseLoadedWordDefinition}
            onAddToDictionary={handleAddWordPOSToSet.apiCall}
          />

          <AnimatedSettingsScreen
            onChangeFullTextTranslationEnabled={setIsTextTranslationEnabledWithPersistence}
            onChangeTargetLanguage={setTargetLangueageWithPersistence}
          />

          <AnimatedDictionaryScreen onDictionaryEntryClick={handleDictionaryEntryClick} />

          <AnimatedWordDefinitionBottomSheet
            show={!!dictionarySnapshot.selectedWordPOS}
            useWordsDefinitions={useWordDefinitionFromDictionary}
            onClose={handleCloseDictionaryWordDefinition}
            onAddToDictionary={handleAddWordPOSToSet.apiCall}
            onDeleteFromDictionary={handleDeleteWordPOSFromSet.apiCall}
          />
        </main>
      </div>

      <AnimatedLearningSession
        rawLoadSetWords={sendGetWordsSetWordsMessage}
        show={!!learningSessinSnapshot.learningSetId}
      />
    </>
  );
};
