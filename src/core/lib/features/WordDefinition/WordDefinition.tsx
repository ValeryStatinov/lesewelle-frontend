import type { Word } from 'core/lib/apiClient/endpoints/types/words';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from 'core/lib/ui/molecules/Accordion/Accordion';

import { WordPOSView } from './WordPOSView';

type Props = {
  wordByLemma: Word;
  wordsByForms: Word[];
};

export const WordDefinition = (props: Props) => {
  const { wordByLemma, wordsByForms } = props;

  return (
    <div className='flex flex-col gap-5'>
      {wordByLemma.wordPOSs.map((pos) => (
        <WordPOSView
          wordPOS={pos}
          lemma={wordByLemma.word}
          isSinglePOS={wordByLemma.wordPOSs.length === 1}
          key={pos.id}
        />
      ))}

      {wordsByForms.length > 0 && (
        <div className='flex flex-col'>
          <div className='mt-1 mb-2 border-t-2 border-stone-300' />

          <Accordion type='single' collapsible>
            <AccordionItem value='inflected-forms'>
              <AccordionTrigger className='max-w-fit'>Also appears as inflected form</AccordionTrigger>
              <AccordionContent>
                <div className='mt-3 flex flex-col gap-5'>
                  {wordsByForms.map((w) => (
                    <div key={w.id}>
                      {w.wordPOSs.map((pos) => (
                        <WordPOSView wordPOS={pos} lemma={w.word} isSinglePOS={w.wordPOSs.length === 1} key={pos.id} />
                      ))}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </div>
  );
};
