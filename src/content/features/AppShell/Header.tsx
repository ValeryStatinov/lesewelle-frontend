import type { Ref } from 'react';
import { BookOpen, CircleMinus, Move, Settings } from 'lucide-react';
import { useSnapshot } from 'valtio';

import { setIsWidgetActive } from 'core/lib/state/appState';
import { screensState, setCurrentTab } from 'core/lib/state/screensState';
import { Button } from 'core/lib/ui/atoms/Button/Button';
import GradientText from 'core/lib/ui/molecules/GradientText/GradientText';
import { cn } from 'core/lib/utils/cn';
import { setSelectedLemma } from 'content/state/dictionaryState';

type Props = {
  className?: string;
  dragHandleRef: Ref<HTMLButtonElement>;
};

const getCommonButtonStyles = (hasActiveTab: boolean) =>
  cn(
    `
      opacity-0 transition-opacity duration-150
      group-hover:opacity-100
    `,
    hasActiveTab && 'opacity-100',
  );

export const Header = (props: Props) => {
  const { className, dragHandleRef } = props;

  const { currentTab } = useSnapshot(screensState);

  const handleCloseApp = () => {
    setIsWidgetActive(false);
  };

  const handleToggleSettings = () => {
    if (currentTab === 'settings') {
      setCurrentTab(undefined);
      return;
    }

    setCurrentTab('settings');
  };

  const handleToggleDictionary = () => {
    if (currentTab === 'dictionary') {
      setCurrentTab(undefined);
      setSelectedLemma(undefined);
      return;
    }

    setCurrentTab('dictionary');
  };

  const commonButtonStyles = getCommonButtonStyles(currentTab !== undefined);
  const activeTabButtonStyles = cn(
    `
      bg-blue-50
      hover:bg-blue-100
    `,
    commonButtonStyles,
  );

  return (
    <div className={cn('group grid grid-cols-3 items-center bg-white', className)}>
      <Button
        ref={dragHandleRef}
        variant='ghost'
        size='icon-sm'
        title='Move widget'
        className={cn(`cursor-grab justify-self-start`, commonButtonStyles)}
      >
        <Move />
      </Button>

      <GradientText className='justify-self-center select-none'>
        <h1 className={cn('cursor-default justify-self-center text-lg font-bold')}>Lesewelle</h1>
      </GradientText>

      <div className='flex items-center gap-1 justify-self-end'>
        <Button
          variant='ghost'
          size='icon-sm'
          title='Settings'
          className={cn(commonButtonStyles, currentTab === 'settings' && activeTabButtonStyles)}
          onClick={handleToggleSettings}
        >
          <Settings className='cursor-pointer' />
        </Button>

        <Button
          variant='ghost'
          size='icon-sm'
          title='My dictionary'
          className={cn(commonButtonStyles, currentTab === 'dictionary' && activeTabButtonStyles)}
          onClick={handleToggleDictionary}
        >
          <BookOpen className='cursor-pointer' />
        </Button>

        <Button
          variant='ghost'
          size='icon-sm'
          title='Close widget'
          className={commonButtonStyles}
          onClick={handleCloseApp}
        >
          <CircleMinus className='cursor-pointer' />
        </Button>
      </div>
    </div>
  );
};
