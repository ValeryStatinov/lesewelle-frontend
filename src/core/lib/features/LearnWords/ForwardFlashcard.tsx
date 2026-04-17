import { type MouseEvent, type RefObject, useRef } from 'react';

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
import { humanReadableWordPOSType } from 'core/lib/utils/consts';
import { formatLemma } from 'core/lib/utils/strings';

type FrontProps = {
  wordPOS: WordPOSWithLemma;
  usageExamplesTriggerRef: RefObject<HTMLButtonElement | null>;
};

const Front = (props: FrontProps) => {
  const { wordPOS, usageExamplesTriggerRef } = props;

  const pos = wordPOS.nounProperties?.gender
    ? `${humanReadableWordPOSType[wordPOS.posType]} (${wordPOS.nounProperties.gender})`
    : humanReadableWordPOSType[wordPOS.posType];

  return (
    <div className='flex min-h-full items-center p-3'>
      <div className='flex w-full flex-wrap items-center justify-center gap-2'>
        <LemmaTag>{formatLemma(wordPOS.lemma, wordPOS.nounProperties?.gender)}</LemmaTag>
        <span className='text-sm text-stone-400'>{pos}</span>

        {wordPOS.usageExamples.length > 0 && (
          <Accordion type='single' collapsible>
            <AccordionItem value='usage-examples' className='flex flex-col items-center'>
              <AccordionTrigger
                ref={usageExamplesTriggerRef}
                className='max-w-fit cursor-help font-normal text-stone-400'
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
  side?: FlashcardSideType;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
};

export const ForwardFlashcard = (props: Props) => {
  const { wordPOS, side, onClick, className } = props;

  const usageExamplesTriggerRef = useRef<HTMLButtonElement>(null);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === usageExamplesTriggerRef.current) {
      return;
    }

    onClick?.(event);
  };

  return (
    <AbstractFlashcard
      side={side}
      front={<Front wordPOS={wordPOS} usageExamplesTriggerRef={usageExamplesTriggerRef} />}
      back={<WordPOSView wordPOS={wordPOS} className='p-3' isSinglePOS />}
      className={className}
      onClick={handleClick}
    />
  );
};
