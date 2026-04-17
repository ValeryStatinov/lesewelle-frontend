import { type MouseEvent, type PropsWithChildren, type ReactNode, useEffect, useState } from 'react';

import type { WithClassName } from 'core/lib/types/common';
import { cn } from 'core/lib/utils/cn';

export type FlashcardSideType = 'front' | 'back';

type FlashcardSideProps = WithClassName & {
  flipped?: boolean;
  show: boolean;
};

const FlashcardSide = (props: PropsWithChildren<FlashcardSideProps>) => {
  const { children, flipped, show, className } = props;

  return (
    <div
      className={cn(
        'hide-scrollbar absolute z-[-1] h-full w-full overflow-auto backface-hidden',
        flipped && 'rotate-y-180',
        show && 'z-1',
        className,
      )}
    >
      {children}
    </div>
  );
};

type Props = {
  side?: FlashcardSideType;
  front: ReactNode;
  back: ReactNode;
  className?: string;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
};

export const AbstractFlashcard = (props: Props) => {
  const { front, back, side, onClick, className } = props;
  const [effectiveSide, setEffectiveSide] = useState<FlashcardSideType>(side ?? 'front');

  useEffect(() => {
    if (!!side) {
      setEffectiveSide(side);
    }
  }, [side]);

  useEffect(() => {
    if (!side) {
      setEffectiveSide('front');
    }
  }, [side, front, back]);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    onClick?.(event);
    if (!!side) {
      return;
    }

    const newSide = effectiveSide === 'front' ? 'back' : 'front';
    setEffectiveSide(newSide);
  };

  return (
    <div className={cn('cursor-pointer perspective-midrange', className)} onClick={handleClick}>
      <div
        className={cn(
          'relative h-full w-full rounded-sm bg-white transition-transform duration-300 transform-3d',
          effectiveSide === 'back' && 'rotate-y-180',
        )}
      >
        <FlashcardSide show={effectiveSide === 'front'}>{front}</FlashcardSide>
        <FlashcardSide show={effectiveSide === 'back'} flipped>
          {back}
        </FlashcardSide>
      </div>
    </div>
  );
};
