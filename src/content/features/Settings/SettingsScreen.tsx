import { useSnapshot } from 'valtio';

import {
  trackChangeFullTextTranslationEnabled,
  trackChangeTargetLanguage,
  trackOpenSettings,
} from 'core/lib/amplitude/contentScriptTrackers';
import { useTrackOpen } from 'core/lib/amplitude/useTrackOpen';
import { Settings } from 'core/lib/features/Settings/Settings';
import { screensState } from 'core/lib/state/screensState';
import type { TargetLanguage } from 'core/lib/types/languages';
import { Separator } from 'core/lib/ui/atoms/Separator/Separator';
import { Screen } from 'core/lib/ui/molecules/Screen/Screen';
import type { ScreenProps } from 'core/lib/ui/molecules/Screen/types';
import { Animator } from 'core/lib/ui/organisms/Animator/Animator';
import { cn } from 'core/lib/utils/cn';

type OwnProps = {
  onChangeFullTextTranslationEnabled: (isFullTextTranslationEnabled: boolean) => void;
  onChangeTargetLanguage: (targetLanguage: TargetLanguage) => void;
};

const SettingsScreen = (props: ScreenProps & OwnProps) => {
  const { className, onAnimationEnd, onTransitionEnd, onChangeFullTextTranslationEnabled, onChangeTargetLanguage } =
    props;

  useTrackOpen(trackOpenSettings);

  const handleChangeTargetLanguage = (targetLanguage: TargetLanguage) => {
    onChangeTargetLanguage(targetLanguage);
    trackChangeTargetLanguage(targetLanguage);
  };

  const handleChangeFullTextTranslationEnabled = (enabled: boolean) => {
    onChangeFullTextTranslationEnabled(enabled);
    trackChangeFullTextTranslationEnabled(enabled);
  };

  return (
    <Screen className={cn('p-3 pt-0', className)} onAnimationEnd={onAnimationEnd} onTransitionEnd={onTransitionEnd}>
      <Separator />
      <Settings
        className='mt-2'
        onChangeFullTextTranslationEnabled={handleChangeFullTextTranslationEnabled}
        onChangeTargetLanguage={handleChangeTargetLanguage}
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
