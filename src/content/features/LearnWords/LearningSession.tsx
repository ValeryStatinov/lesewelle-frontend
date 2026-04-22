import { useMemo, useState } from 'react';
import { RemoveScroll } from 'react-remove-scroll';

import {
  trackStudyWordsEasy,
  trackStudyWordsFlipFlashcard,
  trackStudyWordsHard,
  trackStudyWordsMedium,
  trackStudyWordsSessionAborted,
  trackStudyWordsSessionFinished,
  trackStudyWordsToggleUsageExamples,
} from 'core/lib/amplitude/contentScriptTrackers';
import type { GetWordsSetWordsResponse } from 'core/lib/apiClient/endpoints/sets';
import type { Id } from 'core/lib/apiClient/endpoints/types/basemodel';
import type { Paginator } from 'core/lib/apiClient/endpoints/types/paginator';
import type { WordPOSWithLemma } from 'core/lib/apiClient/endpoints/types/words';
import { ForwardFlashcard } from 'core/lib/features/LearnWords/ForwardFlashcard';
import { useLearningSession } from 'core/lib/features/LearnWords/useLearningSession';
import { setLearningSetId } from 'core/lib/state/learningSessionState';
import type { TargetLanguage } from 'core/lib/types/languages';
import { Backdrop } from 'core/lib/ui/atoms/Backdrop/Backdrop';
import { Button } from 'core/lib/ui/atoms/Button/Button';
import type { FlashcardSideType } from 'core/lib/ui/molecules/AbstractFlashcard/AbstractFlashcard';
import { type AnimatedComponentRequiredProps, Animator } from 'core/lib/ui/organisms/Animator/Animator';
import { cn } from 'core/lib/utils/cn';
import { useEventCallback } from 'core/lib/utils/useEventCallback';

import { getRandomFinishMessage } from './helpers';

const CARD_EXIT_ANIMATION_DURATION = 350;

const ANALYTICS_TRACKER_BY_DIFFICULTY = {
  hard: trackStudyWordsHard,
  medium: trackStudyWordsMedium,
  easy: trackStudyWordsEasy,
};

type OwnProps = {
  rawLoadSetWords: (setId: Id, lang: TargetLanguage, p: Paginator) => Promise<GetWordsSetWordsResponse>;
};

type LearningSessionProps = OwnProps & AnimatedComponentRequiredProps;

export const LearningSession = (props: LearningSessionProps) => {
  const { rawLoadSetWords, onAnimationEnd, onTransitionEnd, className } = props;

  const {
    currentWordPOS,
    loading,
    isLearningSessionFinished,
    handleEasyClick,
    handleMediumClick,
    handleHardClick,
    error,
    getTimeSpentOnCardMs,
    getCardsReviewed,
    getTotalSetSize,
  } = useLearningSession({ rawLoadSetWords });

  const [showConfirmExit, setShowConfirmExit] = useState(false);
  const handleConfirmExit = () => {
    setLearningSetId(undefined);

    const sessionEndParams = {
      cardsReviewed: getCardsReviewed(),
      totalSetSize: getTotalSetSize(),
    };

    if (showConfirmExit) {
      trackStudyWordsSessionAborted(sessionEndParams);
    } else {
      trackStudyWordsSessionFinished(sessionEndParams);
    }
  };

  const handleCancelExit = () => {
    setShowConfirmExit(false);
  };

  const handleBackdropClick = () => {
    setShowConfirmExit(true);
  };

  const [flashcardSide, setFlashcardSide] = useState<FlashcardSideType>('front');
  const handleFlashcardFlip = () => {
    const side: FlashcardSideType = flashcardSide === 'front' ? 'back' : 'front';
    setFlashcardSide(side);

    trackStudyWordsFlipFlashcard(currentWordPOS);
  };

  const [usageExamplesOpen, setUsageExamplesOpen] = useState(false);
  const handleToggleUsageExamples = () => {
    trackStudyWordsToggleUsageExamples(!usageExamplesOpen);
    setUsageExamplesOpen((cur) => !cur);
  };

  const [prevFlashcardAnimationData, setPrevFlashcardAnimationData] = useState<{
    prevWordPOS: WordPOSWithLemma | undefined;
    prevSide: FlashcardSideType;
  }>({
    prevWordPOS: undefined,
    prevSide: 'front',
  });

  const handleClick = useEventCallback((difficulty: 'hard' | 'medium' | 'easy') => {
    if (!currentWordPOS || !!prevFlashcardAnimationData.prevWordPOS) {
      return;
    }

    setPrevFlashcardAnimationData({
      prevWordPOS: currentWordPOS,
      prevSide: flashcardSide,
    });

    setTimeout(() => {
      setPrevFlashcardAnimationData((cur) => ({
        ...cur,
        prevWordPOS: undefined,
      }));
    }, CARD_EXIT_ANIMATION_DURATION);

    const actionByDifficulty = {
      hard: handleHardClick,
      medium: handleMediumClick,
      easy: handleEasyClick,
    };

    const timeSpentMs = getTimeSpentOnCardMs();

    const action = actionByDifficulty[difficulty];
    action(currentWordPOS);

    const analyticsTracker = ANALYTICS_TRACKER_BY_DIFFICULTY[difficulty];
    analyticsTracker({
      pos: currentWordPOS,
      side: flashcardSide,
      usageExamplesOpen,
      timeSpentMs,
    });

    setFlashcardSide('front');
  });

  const finishMessage = useMemo(() => getRandomFinishMessage(), []);

  return (
    <div
      onAnimationEnd={onAnimationEnd}
      onTransitionEnd={onTransitionEnd}
      className={cn('relative z-100000 opacity-0 transition-all duration-300', className)}
    >
      <RemoveScroll>
        <Backdrop onClick={handleBackdropClick} />
        <div className='fixed top-1/2 left-1/2 -translate-1/2'>
          {loading && !currentWordPOS && <div className='rounded-sm bg-white p-4'>Loading...</div>}

          {isLearningSessionFinished && (
            <div className='rounded-sm bg-white p-4'>
              <h3 className='text-lg font-bold'>{finishMessage}</h3>
              <div className='mt-4 flex justify-end'>
                <Button size='sm' onClick={handleConfirmExit}>
                  Finish and close
                </Button>
              </div>
            </div>
          )}

          {error && !showConfirmExit && <div className='rounded-sm bg-white p-4'>{error}</div>}

          {showConfirmExit && (
            <div className='rounded-sm bg-white p-4'>
              <h3 className='text-lg font-bold'>Finish learning session?</h3>
              <div className='mt-4 flex gap-3'>
                <Button variant='outline' onClick={handleCancelExit} size='sm'>
                  Continue learning
                </Button>
                <Button size='sm' onClick={handleConfirmExit}>
                  Finish and close
                </Button>
              </div>
            </div>
          )}

          {currentWordPOS && !showConfirmExit && !error && (
            <div className='flex flex-col gap-4'>
              <ForwardFlashcard
                wordPOS={currentWordPOS}
                className='h-96 w-80'
                side={flashcardSide}
                usageExamplesOpen={usageExamplesOpen}
                onUsageExamplesClick={handleToggleUsageExamples}
                onClick={handleFlashcardFlip}
              />

              <div className='grid w-80 grid-cols-3 gap-3.5'>
                <Button
                  onClick={() => {
                    handleClick('hard');
                  }}
                >
                  Hard
                </Button>
                <Button
                  onClick={() => {
                    handleClick('medium');
                  }}
                >
                  Medium
                </Button>
                <Button
                  onClick={() => {
                    handleClick('easy');
                  }}
                >
                  Easy
                </Button>
              </div>
            </div>
          )}

          {prevFlashcardAnimationData.prevWordPOS && currentWordPOS && (
            <ForwardFlashcard
              wordPOS={prevFlashcardAnimationData.prevWordPOS}
              className='absolute top-0 left-0 h-96 w-80 animate-card-exit'
              side={prevFlashcardAnimationData.prevSide}
              usageExamplesOpen={usageExamplesOpen}
              onClick={handleFlashcardFlip}
            />
          )}
        </div>
      </RemoveScroll>
    </div>
  );
};

type AnimatedLearningSessionProps = OwnProps & {
  show: boolean;
};

export const AnimatedLearningSession = (props: AnimatedLearningSessionProps) => {
  const { show, rawLoadSetWords } = props;

  const dataProp: OwnProps = useMemo(() => ({ rawLoadSetWords }), [rawLoadSetWords]);

  return (
    <Animator<OwnProps>
      onEnterClassName='opacity-100'
      onExitClassName=''
      show={show}
      Component={LearningSession}
      data={dataProp}
    />
  );
};
