import { type MouseEvent } from 'react';

import type { WordPOSWithLemma } from 'core/lib/apiClient/endpoints/types/words';
import type { WithClassName } from 'core/lib/types/common';
import { LemmaTag } from 'core/lib/ui/atoms/LemmaTag/LemmaTag';
import { AbstractFlashcard, type FlashcardSideType } from 'core/lib/ui/molecules/AbstractFlashcard/AbstractFlashcard';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from 'core/lib/ui/molecules/Accordion/Accordion';
import { UsageExamples } from 'core/lib/ui/organisms/WordPOSView/UsageExamples';
import { WordPOSView } from 'core/lib/ui/organisms/WordPOSView/WordPOSView';
import { formatLemma, formatPOSType } from 'core/lib/utils/strings';

type FrontProps = {
  wordPOS: WordPOSWithLemma;
  usageExamplesOpen: boolean;
  onUsageExamplesClick?: () => void;
};

const Front = (props: FrontProps) => {
  const { wordPOS, usageExamplesOpen, onUsageExamplesClick } = props;

  const handleUsageExamplesClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onUsageExamplesClick?.();
  };

  return (
    <div className='flex min-h-full items-center p-3'>
      <div className='flex w-full flex-wrap items-center justify-center gap-2'>
        <LemmaTag>{formatLemma(wordPOS.lemma, wordPOS.nounProperties?.gender)}</LemmaTag>
        <span className='text-sm text-stone-400'>{formatPOSType(wordPOS.posType, wordPOS.nounProperties?.gender)}</span>

        {wordPOS.usageExamples.length > 0 && (
          <Accordion type='single' collapsible value={usageExamplesOpen ? 'usage-examples' : ''}>
            <AccordionItem value='usage-examples' className='flex flex-col items-center'>
              <AccordionTrigger
                className='max-w-fit cursor-help font-normal text-stone-400'
                onClick={handleUsageExamplesClick}
              >
                Reveal usage examples
              </AccordionTrigger>
              <AccordionContent>
                <UsageExamples usageExamples={wordPOS.usageExamples} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>
    </div>
  );
};

type Props = WithClassName & {
  wordPOS: WordPOSWithLemma;
  side: FlashcardSideType;
  usageExamplesOpen: boolean;
  onUsageExamplesClick?: () => void;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
};

export const ForwardFlashcard = (props: Props) => {
  const { wordPOS, side, usageExamplesOpen, onUsageExamplesClick, onClick, className } = props;

  return (
    <AbstractFlashcard
      side={side}
      front={
        <Front wordPOS={wordPOS} usageExamplesOpen={usageExamplesOpen} onUsageExamplesClick={onUsageExamplesClick} />
      }
      back={<WordPOSView wordPOS={wordPOS} className='p-3' isSinglePOS />}
      className={className}
      onClick={onClick}
    />
  );
};
