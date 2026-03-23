import { useMemo } from 'react';
import { CircleX } from 'lucide-react';

import { Button } from 'core/lib/ui/atoms/Button/Button';
import { BottomSheet, type BottomSheetProps } from 'core/lib/ui/molecules/BottomSheet/BottomSheet';
import { Animator } from 'core/lib/ui/organisms/Animator/Animator';
import { cn } from 'core/lib/utils/cn';

import type { UseWordDefinitionsReturn } from './types';
import { WordDefinition } from './WordDefinition';

type OwnProps = {
  onClose: () => void;
  useLoadWordsDefinitions: () => UseWordDefinitionsReturn;
};

type WordDefinitionBottimSheetProps = BottomSheetProps & OwnProps;

const WordDefinitionBottomSheet = (props: WordDefinitionBottimSheetProps) => {
  const { className, onTransitionEnd, onAnimationEnd, onClose, useLoadWordsDefinitions } = props;

  const { definitionsMap, loading, error } = useLoadWordsDefinitions();
  // TODO for complex verbs like 'ich melde mich an' definitions for 'sich anmelden' and 'anmelden'
  // will be loaded to populate database with both word.
  // although in current version only definition for full verb group will be displayed for user
  const firstEntry = Object.values(definitionsMap)[0];
  const lookupWord = firstEntry?.wordByLemma;
  const wordsByForms = firstEntry?.wordsByForms ?? [];

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

      {!loading && !error && lookupWord && <WordDefinition wordByLemma={lookupWord} wordsByForms={wordsByForms} />}
    </BottomSheet>
  );
};

type AnimatedWordDefinitionBottomSheetProps = OwnProps & {
  show: boolean;
};

export const AnimatedWordDefinitionBottomSheet = (props: AnimatedWordDefinitionBottomSheetProps) => {
  const { useLoadWordsDefinitions, onClose, show } = props;

  const dataProp: OwnProps = useMemo(() => ({ useLoadWordsDefinitions, onClose }), [useLoadWordsDefinitions, onClose]);

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
