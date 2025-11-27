import { useSnapshot } from 'valtio';

import { Settings } from 'core/lib/features/Settings/Settings';
import { screensState } from 'core/lib/state/screensState';
import type { TargetLanguage } from 'core/lib/types/languages';
import { Separator } from 'core/lib/ui/atoms/Separator/Separator';
import { Screen } from 'core/lib/ui/molecules/Screen/Screen';
import type { ScreenProps } from 'core/lib/ui/molecules/Screen/types';
import { Animator } from 'core/lib/ui/organisms/Animator/Animator';
import { cn } from 'core/lib/utils/cn';

type OwnProps = {
  onClose: () => void;
  onChangeFullTextTranslationEnabled: (isFullTextTranslationEnabled: boolean) => void;
  onChangeTargetLanguage: (targetLanguage: TargetLanguage) => void;
};

const SettingsScreen = (props: ScreenProps & OwnProps) => {
  const {
    className,
    onClose,
    onAnimationEnd,
    onTransitionEnd,
    onChangeFullTextTranslationEnabled,
    onChangeTargetLanguage,
  } = props;

  return (
    <Screen className={cn('p-3 pt-0', className)} onAnimationEnd={onAnimationEnd} onTransitionEnd={onTransitionEnd}>
      <Separator />
      <Settings
        className='mt-2'
        onClose={onClose}
        onChangeFullTextTranslationEnabled={onChangeFullTextTranslationEnabled}
        onChangeTargetLanguage={onChangeTargetLanguage}
      />
    </Screen>
  );
};

export const AnimatedSettingsScreen = (props: OwnProps) => {
  const { currentTab } = useSnapshot(screensState);

  return (
    <Animator
      show={currentTab === 'settings'}
      onEnterClassName='translate-x-0 opacity-100'
      onExitClassName='opacity-0'
      Component={SettingsScreen}
      data={props}
    />
  );
};
