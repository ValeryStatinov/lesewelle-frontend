import type { Ref } from 'react';
import { setIsWidgetActive } from 'content/state/appState';
import { CircleMinus, Move } from 'lucide-react';

import { Button } from 'core/lib/ui/atoms/Button/Button';
import { cn } from 'core/lib/utils/cn';

type Props = {
  className?: string;
  dragHandleRef: Ref<HTMLButtonElement>;
};

export const Header = (props: Props) => {
  const { className, dragHandleRef } = props;

  const handleCloseApp = () => {
    setIsWidgetActive(false);
  };

  return (
    <div className={cn('group flex items-center justify-between p-2', className)}>
      <Button
        ref={dragHandleRef}
        variant='ghost'
        size='icon-sm'
        className={`
          cursor-grab opacity-0 transition-opacity duration-200
          group-hover:opacity-100
        `}
      >
        <Move />
      </Button>

      <h1 className={cn('text-lg font-bold')}>Lesewelle</h1>

      <Button
        variant='ghost'
        size='icon-sm'
        className={`
          opacity-0
          group-hover:opacity-100
        `}
        onClick={handleCloseApp}
      >
        <CircleMinus className='cursor-pointer' />
      </Button>
    </div>
  );
};
