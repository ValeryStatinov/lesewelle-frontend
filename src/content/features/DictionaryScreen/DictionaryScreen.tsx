import { useSnapshot } from 'valtio';

import { trackOpenDictionary, trackStudyWords } from 'core/lib/amplitude/contentScriptTrackers';
import { useTrackOpen } from 'core/lib/amplitude/useTrackOpen';
import { Dictionary } from 'core/lib/features/Dictionary/Dictionary';
import { screensState } from 'core/lib/state/screensState';
import { Separator } from 'core/lib/ui/atoms/Separator/Separator';
import { Screen } from 'core/lib/ui/molecules/Screen/Screen';
import type { ScreenProps } from 'core/lib/ui/molecules/Screen/types';
import { Animator } from 'core/lib/ui/organisms/Animator/Animator';
import { cn } from 'core/lib/utils/cn';

type OwnProps = {
  useDictionary: () => Record<string, string[]>;
  onDictionaryEntryClick: (lemma: string) => void;
};

const DictionaryScreen = (props: ScreenProps & OwnProps) => {
  const { useDictionary, onDictionaryEntryClick, className, onAnimationEnd, onTransitionEnd } = props;

  useTrackOpen(trackOpenDictionary);
  const handleStudyClick = () => {
    trackStudyWords();
  };

  return (
    <Screen className={cn('p-3 pt-0', className)} onAnimationEnd={onAnimationEnd} onTransitionEnd={onTransitionEnd}>
      <Separator />
      <Dictionary
        className='mt-2 flex h-full flex-1 flex-col'
        useDictionary={useDictionary}
        onDictionaryEntryClick={onDictionaryEntryClick}
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
