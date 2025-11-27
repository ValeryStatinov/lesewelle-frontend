import { useMemo } from 'react';

import { WordTranslation } from 'core/lib/features/WordTranslation/WordTranslation';
import { BottomSheet, type BottomSheetProps } from 'core/lib/ui/molecules/BottomSheet/BottomSheet';
import { Animator } from 'core/lib/ui/organisms/Animator/Animator';
import { cn } from 'core/lib/utils/cn';

import type { UseWordTranslationsReturn } from './types';

type OwnProps = {
  useWordTranslations: () => UseWordTranslationsReturn;
  onClose: () => void;
};

type TranslateWordBottimSheetProps = BottomSheetProps & OwnProps;

const WordTranslationBottomSheet = (props: TranslateWordBottimSheetProps) => {
  const { className, onTransitionEnd, onAnimationEnd, useWordTranslations, onClose } = props;

  const { translationsMap, loading, error } = useWordTranslations();

  return (
    <BottomSheet className={cn('p-3', className)} onAnimationEnd={onAnimationEnd} onTransitionEnd={onTransitionEnd}>
      <WordTranslation translationsMap={translationsMap} loading={loading} error={error} onClose={onClose} />
    </BottomSheet>
  );
};

type AnimatedWordTranslationBottomSheetProps = OwnProps & {
  show: boolean;
};

export const AnimatedWordTranslationBottomSheet = (props: AnimatedWordTranslationBottomSheetProps) => {
  const { useWordTranslations, onClose, show } = props;

  const dataProp: OwnProps = useMemo(() => ({ useWordTranslations, onClose }), [useWordTranslations, onClose]);

  return (
    <Animator<OwnProps>
      onEnterClassName='translate-y-0'
      onExitClassName=''
      show={show}
      Component={WordTranslationBottomSheet}
      data={dataProp}
    />
  );
};
