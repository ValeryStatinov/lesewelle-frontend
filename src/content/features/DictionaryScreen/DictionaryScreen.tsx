import { useSnapshot } from 'valtio';

import { trackOpenDictionary, trackStudyWords } from 'core/lib/amplitude/contentScriptTrackers';
import { useTrackOpen } from 'core/lib/amplitude/useTrackOpen';
import type { WordPOSWithLemma } from 'core/lib/apiClient/endpoints/types/words';
import { Dictionary } from 'core/lib/features/Dictionary/Dictionary';
import { dictionaryState } from 'core/lib/state/dictionaryState';
import { setLearningSetId } from 'core/lib/state/learningSessionState';
import { screensState } from 'core/lib/state/screensState';
import { Separator } from 'core/lib/ui/atoms/Separator/Separator';
import { Screen } from 'core/lib/ui/molecules/Screen/Screen';
import type { ScreenProps } from 'core/lib/ui/molecules/Screen/types';
import { Animator } from 'core/lib/ui/organisms/Animator/Animator';
import { cn } from 'core/lib/utils/cn';

import { loadSetWords } from './dictionaryApiCalls';

type OwnProps = {
  onDictionaryEntryClick: (wordPOS: WordPOSWithLemma) => void;
};

const DictionaryScreen = (props: ScreenProps & OwnProps) => {
  const { onDictionaryEntryClick, className, onAnimationEnd, onTransitionEnd } = props;
  const dictionarySnapshot = useSnapshot(dictionaryState);

  useTrackOpen(trackOpenDictionary);
  const handleStudyClick = () => {
    trackStudyWords();

    if (!dictionarySnapshot.sets.defaultSet) {
      console.error(new Error('default set id is unknown yet'));
      return;
    }

    setLearningSetId(dictionarySnapshot.sets.defaultSet.id);
  };

  return (
    <Screen className={cn('p-3 pt-0', className)} onAnimationEnd={onAnimationEnd} onTransitionEnd={onTransitionEnd}>
      <Separator />
      <Dictionary
        className='mt-2 flex h-full flex-1 flex-col'
        onDictionaryEntryClick={onDictionaryEntryClick}
        loadSetWords={loadSetWords}
        onStudyClick={handleStudyClick}
      />
    </Screen>
  );
};

export const AnimatedDictionaryScreen = (props: OwnProps) => {
  const { currentTab } = useSnapshot(screensState);

  return (
    <Animator
      show={currentTab === 'dictionary'}
      onEnterClassName='translate-x-0 opacity-100'
      onExitClassName='opacity-0'
      Component={DictionaryScreen}
      data={props}
    />
  );
};
