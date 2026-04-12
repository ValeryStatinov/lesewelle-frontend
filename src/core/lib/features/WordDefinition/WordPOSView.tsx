import { useState } from 'react';
import { BookMarked, BookmarkPlus, BookmarkX } from 'lucide-react';
import { useSnapshot } from 'valtio';

import { trackAddToDictionary, trackDeleteFromDictionary } from 'core/lib/amplitude/contentScriptTrackers';
import type { Id } from 'core/lib/apiClient/endpoints/types/basemodel';
import type { WordPOSTypeExtended, WordPOSWithLemma } from 'core/lib/apiClient/endpoints/types/words';
import { dictionaryState } from 'core/lib/state/dictionaryState';
import { Button } from 'core/lib/ui/atoms/Button/Button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from 'core/lib/ui/molecules/Accordion/Accordion';
import { Tooltip, TooltipContent, TooltipTrigger } from 'core/lib/ui/molecules/Tooltip/Tooltip';
import { cn } from 'core/lib/utils/cn';
import { humanReadableWordPOSType } from 'core/lib/utils/consts';
import { capitalizeFirstLetter } from 'core/lib/utils/strings';

import { WordPOSForms } from './WordPOSForms';

const iconByAction = {
  add: <BookmarkPlus />,
  delete: <BookmarkX stroke='var(--color-red-400)' />,
  added: <BookMarked stroke='var(--color-blue-700)' />,
};

const tooltipByAction = {
  add: 'Add to dictionary',
  delete: 'Delete from dictionary',
  added: 'Added to dictionary!',
};

type Props = {
  wordPOS: WordPOSWithLemma;
  lemma: string;
  isSinglePOS?: boolean;
  className?: string;
  onAddToDictionary?: (p: { setId: Id; wordPOSId: Id }) => Promise<void>;
  onDeleteFromDictionary?: (p: { setId: Id; wordPOSId: Id }) => Promise<void>;
};

export const WordPOSView = (props: Props) => {
  const { wordPOS, lemma, isSinglePOS, onAddToDictionary, onDeleteFromDictionary, className } = props;

  const dictionarySnapshot = useSnapshot(dictionaryState);
  const setId = dictionarySnapshot.sets.defaultSet?.id;

  const bothProvided = !!(onAddToDictionary && onDeleteFromDictionary);
  const [currentAction, setCurrentAction] = useState<'add' | 'delete' | 'added'>(bothProvided ? 'delete' : 'add');
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const addOrDeleteIcon = iconByAction[currentAction];
  const addOrDeleteTooltip = tooltipByAction[currentAction];

  const handleMouseEnter = () => {
    setTooltipOpen(true);
  };

  const handleMouseLeave = () => {
    setTooltipOpen(false);
  };

  const handleAddOrDeleteClick = () => {
    if (!setId) {
      console.error('[WordPOSView] no default set id');
      return;
    }

    if (currentAction === 'delete') {
      void onDeleteFromDictionary?.({ setId, wordPOSId: wordPOS.id });
      trackDeleteFromDictionary(wordPOS);

      setCurrentAction('add');
    } else if (currentAction === 'add') {
      void onAddToDictionary?.({ setId, wordPOSId: wordPOS.id });
      trackAddToDictionary(wordPOS);

      setCurrentAction(bothProvided ? 'delete' : 'added');
    }
  };

  const translations = wordPOS.translations.map((t) => t.translation).join(', ');
  const displayLemma = wordPOS.posType === 'NOUN' ? capitalizeFirstLetter(lemma) : lemma;
  const pos = wordPOS.nounProperties?.gender
    ? `${humanReadableWordPOSType[wordPOS.posType]} (${wordPOS.nounProperties.gender})`
    : humanReadableWordPOSType[wordPOS.posType];

  const usageExamplesAndForms = (
    <div className='flex flex-col gap-2'>
      {wordPOS.usageExamples.length > 0 &&
        wordPOS.usageExamples.map((example) => (
          <div
            key={example.id}
            className={`max-w-fit border-l-2 border-blue-200 bg-blue-50/50 py-1 pr-4 pl-2 text-sm text-stone-600 italic`}
          >
            {example.example}
          </div>
        ))}

      {wordPOS.forms.length > 0 && <WordPOSForms forms={wordPOS.forms} className='mt-4' />}
    </div>
  );

  return (
    <div className={cn('flex flex-col', className)}>
      <h2 className='flex flex-wrap items-center pr-8 text-base'>
        <span className='relative mr-2 inline-block rounded-md bg-blue-600 px-2 py-0.5 font-medium text-white'>
          {displayLemma}
        </span>
        <span className='mr-1'>{pos}</span>
        {(onAddToDictionary || onDeleteFromDictionary) && (
          <Tooltip open={tooltipOpen}>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='icon-sm'
                onClick={handleAddOrDeleteClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={cn('justify-self-end', currentAction === 'added' && 'cursor-default')}
              >
                {addOrDeleteIcon}
              </Button>
            </TooltipTrigger>
            <TooltipContent side='bottom'>{addOrDeleteTooltip}</TooltipContent>
          </Tooltip>
        )}
      </h2>

      <div className='mt-3'>
        <h3 className='text-sm text-stone-400'>Translations:</h3>
        {translations && <p className='mt-1 font-semibold'>{translations}</p>}
      </div>

      {wordPOS.verbProperties?.auxVerb && (
        <div className='mt-3'>
          <span className='text-sm text-stone-400'>Aux verb: </span>
          <span>{wordPOS.verbProperties.auxVerb}</span>
        </div>
      )}

      {isSinglePOS && <div className='mt-4'>{usageExamplesAndForms}</div>}

      {!isSinglePOS && (
        <Accordion type='single' collapsible>
          <AccordionItem value='inflected-forms'>
            <AccordionTrigger className='max-w-fit text-stone-400'>Expand usage examples and forms</AccordionTrigger>
            <AccordionContent>{usageExamplesAndForms}</AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
};
