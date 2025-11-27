import type { PropsWithChildren } from 'react';

import type { AnimatedComponentRequiredProps } from 'core/lib/ui/organisms/Animator/Animator';
import { cn } from 'core/lib/utils/cn';

export type BottomSheetProps = AnimatedComponentRequiredProps;

export const BottomSheet = (props: PropsWithChildren<BottomSheetProps>) => {
  const { children, className, onTransitionEnd, onAnimationEnd } = props;

  return (
    <div
      className={cn(
        `
          absolute bottom-0 left-0 h-[calc(52%+8px)] w-full translate-y-full bg-white transition-all duration-200
          ease-out
        `,
        'shadow-[0_0_8px_rgba(0,0,0,0.25)]',
        className,
      )}
      onTransitionEnd={onTransitionEnd}
      onAnimationEnd={onAnimationEnd}
    >
      {children}
    </div>
  );
};
