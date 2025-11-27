import { useMemo } from 'react';

import { WordTranslation } from 'core/lib/features/WordTranslation/WordTranslation';
import { BottomSheet, type BottomSheetProps } from 'core/lib/ui/molecules/BottomSheet/BottomSheet';
import { Animator } from 'core/lib/ui/organisms/Animator/Animator';
import { cn } from 'core/lib/utils/cn';

import type { UseWordTranslationsReturn } from './types';

type OwnProps = {
  useDictionary: () => Record<string, string[]>;
  useWordTranslations: () => UseWordTranslationsReturn;
  onClose: () => void;
  onAddToDictionary: (lemma: string, translations: string[]) => void;
};

type TranslateWordBottimSheetProps = BottomSheetProps & OwnProps;

const WordTranslationBottomSheet = (props: TranslateWordBottimSheetProps) => {
  const { useDictionary, className, onTransitionEnd, onAnimationEnd, useWordTranslations, onClose, onAddToDictionary } =
    props;

  const { translationsMap, loading, error } = useWordTranslations();

  return (
    <BottomSheet className={cn('p-3', className)} onAnimationEnd={onAnimationEnd} onTransitionEnd={onTransitionEnd}>
      <WordTranslation
        translationsMap={translationsMap}
        loading={loading}
        error={error}
        useDictionary={useDictionary}
        onClose={onClose}
        onAddToDictionary={onAddToDictionary}
      />
    </BottomSheet>
  );
};

type AnimatedWordTranslationBottomSheetProps = OwnProps & {
  show: boolean;
};

export const AnimatedWordTranslationBottomSheet = (props: AnimatedWordTranslationBottomSheetProps) => {
  const { useWordTranslations, onClose, onAddToDictionary, show, useDictionary } = props;

  const dataProp: OwnProps = useMemo(
    () => ({ useDictionary, useWordTranslations, onClose, onAddToDictionary }),
    [useDictionary, useWordTranslations, onClose, onAddToDictionary],
  );

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
