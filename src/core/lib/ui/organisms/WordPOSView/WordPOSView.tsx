import { useState } from 'react';
import { BookMarked, BookmarkPlus, BookmarkX } from 'lucide-react';
import { useSnapshot } from 'valtio';

import { trackAddToDictionary, trackDeleteFromDictionary } from 'core/lib/amplitude/contentScriptTrackers';
import type { Id } from 'core/lib/apiClient/endpoints/types/basemodel';
import type { WordPOSWithLemma } from 'core/lib/apiClient/endpoints/types/words';
import { dictionaryState } from 'core/lib/state/dictionaryState';
import { Button } from 'core/lib/ui/atoms/Button/Button';
import { LemmaTag } from 'core/lib/ui/atoms/LemmaTag/LemmaTag';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from 'core/lib/ui/molecules/Accordion/Accordion';
import { Tooltip, TooltipContent, TooltipTrigger } from 'core/lib/ui/molecules/Tooltip/Tooltip';
import { cn } from 'core/lib/utils/cn';
import { humanReadableWordPOSType } from 'core/lib/utils/consts';
import { formatLemma } from 'core/lib/utils/strings';

import { UsageExamples } from './UsageExamples';
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
  isSinglePOS?: boolean;
  className?: string;
  onAddToDictionary?: (p: { setId: Id; wordPOSId: Id }) => Promise<void>;
  onDeleteFromDictionary?: (p: { setId: Id; wordPOSId: Id }) => Promise<void>;
};

export const WordPOSView = (props: Props) => {
  const { wordPOS, isSinglePOS, onAddToDictionary, onDeleteFromDictionary, className } = props;

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
  const pos = wordPOS.nounProperties?.gender
    ? `${humanReadableWordPOSType[wordPOS.posType]} (${wordPOS.nounProperties.gender})`
    : humanReadableWordPOSType[wordPOS.posType];

  const usageExamplesAndForms = (
    <>
      {wordPOS.usageExamples.length > 0 && <UsageExamples usageExamples={wordPOS.usageExamples} />}
      {wordPOS.forms.length > 0 && <WordPOSForms forms={wordPOS.forms} className='mt-4' />}
    </>
  );

  return (
    <div className={cn('flex flex-col', className)}>
      <h2 className='flex flex-wrap items-center pr-8 text-base'>
        <LemmaTag className='mr-2'>{formatLemma(wordPOS.lemma, wordPOS.nounProperties?.gender)}</LemmaTag>
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
