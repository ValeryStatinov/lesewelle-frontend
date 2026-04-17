import { useEffect, useMemo } from 'react';
import { RemoveScroll } from 'react-remove-scroll';

import type { GetWordsSetWordsResponse } from 'core/lib/apiClient/endpoints/sets';
import type { Id } from 'core/lib/apiClient/endpoints/types/basemodel';
import type { Paginator } from 'core/lib/apiClient/endpoints/types/paginator';
import { ForwardFlashcard } from 'core/lib/features/LearnWords/ForwardFlashcard';
import { useLearningSession } from 'core/lib/features/LearnWords/useLearningSession';
import { setLearningSetId } from 'core/lib/state/learningSessionState';
import type { TargetLanguage } from 'core/lib/types/languages';
import { Backdrop } from 'core/lib/ui/atoms/Backdrop/Backdrop';
import { Button } from 'core/lib/ui/atoms/Button/Button';
import { type AnimatedComponentRequiredProps, Animator } from 'core/lib/ui/organisms/Animator/Animator';
import { cn } from 'core/lib/utils/cn';

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
  } = useLearningSession({ rawLoadSetWords });

  const handleBackdropClick = () => {
    setLearningSetId(undefined);
  };

  return (
    <div
      onAnimationEnd={onAnimationEnd}
      onTransitionEnd={onTransitionEnd}
      className={cn('relative z-100000 opacity-0 transition-all duration-300', className)}
    >
      <RemoveScroll>
        <Backdrop onClick={handleBackdropClick} />
        {loading && <div className='fixed top-1/2 left-1/2 -translate-1/2 rounded-sm bg-white p-4'>Loading...</div>}

        {isLearningSessionFinished && (
          <div className='fixed top-1/2 left-1/2 -translate-1/2 rounded-sm bg-white p-4'>
            All words are learned! Have a break!
          </div>
        )}

        {error && <div className='fixed top-1/2 left-1/2 -translate-1/2 rounded-sm bg-white p-4'>{error}</div>}

        {currentWordPOS && (
          <div className='fixed top-1/2 left-1/2 flex -translate-1/2 flex-col gap-4'>
            <ForwardFlashcard wordPOS={currentWordPOS} className='h-96 w-80' />
            <div className='grid w-80 grid-cols-3 gap-3.5'>
              <Button
                onClick={() => {
                  handleHardClick(currentWordPOS);
                }}
              >
                Hard
              </Button>
              <Button
                onClick={() => {
                  handleMediumClick(currentWordPOS);
                }}
              >
                Medium
              </Button>
              <Button
                onClick={() => {
                  handleEasyClick(currentWordPOS);
                }}
              >
                Easy
              </Button>
            </div>
          </div>
        )}
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
