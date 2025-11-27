import type { PropsWithChildren } from 'react';

import { cn } from 'core/lib/utils/cn';

import type { ScreenProps } from './types';

export const Screen = (props: PropsWithChildren<ScreenProps>) => {
  const { children, className, onTransitionEnd, onAnimationEnd } = props;

  return (
    <div
      className={cn(
        'absolute top-0 left-0 h-full w-full translate-x-full bg-white opacity-70 transition-all duration-500 ease-out',
        className,
      )}
      onTransitionEnd={onTransitionEnd}
      onAnimationEnd={onAnimationEnd}
    >
      {children}
    </div>
  );
};
