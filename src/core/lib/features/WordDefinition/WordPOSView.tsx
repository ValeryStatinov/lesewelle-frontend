import type { WordPOS, WordPOSTypeExtended } from 'core/lib/apiClient/endpoints/types/words';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from 'core/lib/ui/molecules/Accordion/Accordion';
import { cn } from 'core/lib/utils/cn';
import { capitalizeFirstLetter } from 'core/lib/utils/strings';

import { WordPOSForms } from './WordPOSForms';

const humanReadableWordPOSType: Record<WordPOSTypeExtended, string> = {
  ADJ: 'Adjective',
  ADP: 'Adposition',
  ADV: 'Adverb',
  AUX: 'Auxiliary verb',
  CCONJ: 'Coordinating conjunction',
  INTJ: 'Interjection',
  NOUN: 'Noun',
  NUM: 'Numeral',
  PART: 'Particle',
  PRON: 'Pronoun',
  PROPN: 'Proper noun',
  PUNCT: 'Punctuation',
  SCONJ: 'Subordinating conjunction',
  SYM: 'Symbol',
  VERB: 'Verb',
  X: 'Other',
  DET: 'Determiner',
  DEFINITE_ARTICLE: 'Definite article',
  INDEFINITE_ARTICLE: 'Indefinite article',
  DEMONSTRATIVE: 'Demonstrative',
  POSSESSIVE: 'Possessive pronoun',
};

type Props = {
  wordPOS: WordPOS;
  lemma: string;
  isSinglePOS?: boolean;
  className?: string;
};

export const WordPOSView = (props: Props) => {
  const { wordPOS, lemma, isSinglePOS, className } = props;
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
      <h2 className='text-base'>
        <span className='relative mr-2 inline-block rounded-md bg-blue-600 px-2 py-0.5 font-medium text-white'>
          {displayLemma}
        </span>
        <span>{pos}</span>
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
