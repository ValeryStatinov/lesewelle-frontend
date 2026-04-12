import { useMemo } from 'react';
import { CircleX } from 'lucide-react';

import type { Id } from 'core/lib/apiClient/endpoints/types/basemodel';
import { Button } from 'core/lib/ui/atoms/Button/Button';
import { BottomSheet, type BottomSheetProps } from 'core/lib/ui/molecules/BottomSheet/BottomSheet';
import { Animator } from 'core/lib/ui/organisms/Animator/Animator';
import { cn } from 'core/lib/utils/cn';

import type { UseWordDefinitionsReturn } from './types';
import { WordDefinition } from './WordDefinition';

type OwnProps = {
  onClose: () => void;
  useWordsDefinitions: () => UseWordDefinitionsReturn;
  onAddToDictionary?: (p: { setId: Id; wordPOSId: Id }) => Promise<void>;
  onDeleteFromDictionary?: (p: { setId: Id; wordPOSId: Id }) => Promise<void>;
};

type WordDefinitionBottimSheetProps = BottomSheetProps & OwnProps;

const WordDefinitionBottomSheet = (props: WordDefinitionBottimSheetProps) => {
  const {
    className,
    onTransitionEnd,
    onAnimationEnd,
    onClose,
    useWordsDefinitions,
    onAddToDictionary,
    onDeleteFromDictionary,
  } = props;

  const { definitionsMap, loading, error } = useWordsDefinitions();
  // TODO for complex verbs like 'ich melde mich an' definitions for 'sich anmelden' and 'anmelden'
  // will be loaded to populate database with both word.
  // although in current version only definition for full verb group will be displayed for user
  const firstEntry = Object.values(definitionsMap)[0];
  const wordPOSsByLemma = firstEntry?.wordPOSsByLemma;
  const wordPOSsByForm = firstEntry?.wordPOSsByForm;

  return (
    <BottomSheet
      className={cn('hide-scrollbar h-82 overflow-auto p-3 select-none', className)}
      onAnimationEnd={onAnimationEnd}
      onTransitionEnd={onTransitionEnd}
    >
      <Button variant='ghost' size='icon-sm' onClick={onClose} className='absolute top-3 right-3'>
        <CircleX className='cursor-pointer' />
      </Button>

      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}

      {!loading && !error && wordPOSsByLemma && (
        <WordDefinition
          wordPOSsByLemma={wordPOSsByLemma}
          wordPOSsByForm={wordPOSsByForm}
          onAddToDictionary={onAddToDictionary}
          onDeleteFromDictionary={onDeleteFromDictionary}
        />
      )}
    </BottomSheet>
  );
};

type AnimatedWordDefinitionBottomSheetProps = OwnProps & {
  show: boolean;
};

export const AnimatedWordDefinitionBottomSheet = (props: AnimatedWordDefinitionBottomSheetProps) => {
  const { useWordsDefinitions, onAddToDictionary, onDeleteFromDictionary, onClose, show } = props;

  const dataProp: OwnProps = useMemo(
    () => ({ useWordsDefinitions, onAddToDictionary, onDeleteFromDictionary, onClose }),
    [useWordsDefinitions, onAddToDictionary, onDeleteFromDictionary, onClose],
  );

  return (
    <Animator<OwnProps>
      onEnterClassName='translate-y-0'
      onExitClassName=''
      show={show}
      Component={WordDefinitionBottomSheet}
      data={dataProp}
    />
  );
};
