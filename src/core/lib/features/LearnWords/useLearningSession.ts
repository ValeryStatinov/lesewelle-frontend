import { useEffect, useRef, useState } from 'react';
import { useSnapshot } from 'valtio';

import type { GetWordsSetWordsResponse } from 'core/lib/apiClient/endpoints/sets';
import type { Id } from 'core/lib/apiClient/endpoints/types/basemodel';
import type { Paginator } from 'core/lib/apiClient/endpoints/types/paginator';
import type { WordPOSWithLemma } from 'core/lib/apiClient/endpoints/types/words';
import { appState } from 'core/lib/state/appState';
import { learningSessionState } from 'core/lib/state/learningSessionState';
import type { TargetLanguage } from 'core/lib/types/languages';
import { useApiCaller } from 'core/lib/utils/apiCaller';
import { useEventCallback } from 'core/lib/utils/useEventCallback';

import { StudyQueue } from './studyQueue';

type Params = {
  rawLoadSetWords: (setId: Id, lang: TargetLanguage, p: Paginator) => Promise<GetWordsSetWordsResponse>;
};

export const useLearningSession = (params: Params) => {
  const { rawLoadSetWords } = params;

  const studyQueueRef = useRef(new StudyQueue<WordPOSWithLemma>());
  const [paginator, setPaginator] = useState<Paginator>({ limit: 100, offset: 0 });
  const [currentWordPOS, setCurrentWordPOS] = useState<WordPOSWithLemma | undefined>(undefined);
  const [isSetFullyLoaded, setIsSetFullyLoaded] = useState(false);
  const [isLearningSessionFinished, setIsLearningSessionFinished] = useState(false);

  const appSnapshot = useSnapshot(appState);
  const learningSessionSnapshot = useSnapshot(learningSessionState);

  const updateWordPOSToNext = useEventCallback(() => {
    const next = studyQueueRef.current.nextCard();
    if (!next) {
      if (isSetFullyLoaded) {
        setIsLearningSessionFinished(true);
        return;
      }

      console.error(new Error('[useLearningSession] no next card and set is not fully loaded'));
      return;
    }

    setCurrentWordPOS(next);
  });

  const loadSetWordsApiCaller = useApiCaller(async () => {
    if (!learningSessionSnapshot.learningSetId) {
      return;
    }

    const result = await rawLoadSetWords(
      learningSessionSnapshot.learningSetId,
      appSnapshot.targetTranslationLanguage,
      paginator,
    );

    const newPaginator = {
      limit: paginator.limit,
      offset: paginator.offset + paginator.limit,
    };
    setPaginator(newPaginator);

    if (result.setWords.length < paginator.limit) {
      setIsSetFullyLoaded(true);
    }

    if (studyQueueRef.current.size() === 0) {
      studyQueueRef.current = new StudyQueue({ initialItems: result.setWords });
    } else {
      studyQueueRef.current.addToQueue(result.setWords);
    }

    if (!currentWordPOS) {
      updateWordPOSToNext();
    }
  });

  const { apiCall: loadSetWords } = loadSetWordsApiCaller;

  useEffect(() => {
    void loadSetWords();
  }, [loadSetWords]);

  const handleEasyClick = useEventCallback((wordPOS: WordPOSWithLemma) => {
    studyQueueRef.current.onEasy(wordPOS);

    updateWordPOSToNext();

    if (studyQueueRef.current.size() <= 3 && !isSetFullyLoaded && !loadSetWordsApiCaller.loading) {
      void loadSetWords();
    }
  });

  const handleMediumClick = useEventCallback((wordPOS: WordPOSWithLemma) => {
    studyQueueRef.current.onMedium(wordPOS);
    updateWordPOSToNext();
  });

  const handleHardClick = useEventCallback((wordPOS: WordPOSWithLemma) => {
    studyQueueRef.current.onHard(wordPOS);
    updateWordPOSToNext();
  });

  return {
    currentWordPOS,
    loading: loadSetWordsApiCaller.loading,
    error: loadSetWordsApiCaller.error,
    handleEasyClick,
    handleMediumClick,
    handleHardClick,
    isLearningSessionFinished,
  };
};
