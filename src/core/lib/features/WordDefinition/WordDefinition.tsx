import type { Id } from 'core/lib/apiClient/endpoints/types/basemodel';
import type { WordPOSWithLemma } from 'core/lib/apiClient/endpoints/types/words';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from 'core/lib/ui/molecules/Accordion/Accordion';

import { WordPOSView } from './WordPOSView';

type Props = {
  wordPOSsByLemma: WordPOSWithLemma[];
  wordPOSsByForm?: WordPOSWithLemma[];
  onAddToDictionary?: (p: { setId: Id; wordPOSId: Id }) => Promise<void>;
  onDeleteFromDictionary?: (p: { setId: Id; wordPOSId: Id }) => Promise<void>;
};

export const WordDefinition = (props: Props) => {
  const { wordPOSsByLemma, wordPOSsByForm, onAddToDictionary, onDeleteFromDictionary } = props;

  return (
    <div className='flex flex-col gap-5'>
      {wordPOSsByLemma.map((pos) => (
        <WordPOSView
          wordPOS={pos}
          lemma={pos.lemma}
          isSinglePOS={wordPOSsByLemma.length === 1}
          key={pos.id}
          onAddToDictionary={onAddToDictionary}
          onDeleteFromDictionary={onDeleteFromDictionary}
        />
      ))}

      {wordPOSsByForm && wordPOSsByForm.length > 0 && (
        <div className='flex flex-col'>
          <div className='mt-1 mb-2 border-t-2 border-stone-300' />

          <Accordion type='single' collapsible>
            <AccordionItem value='inflected-forms'>
              <AccordionTrigger className='max-w-fit'>Also appears as inflected form</AccordionTrigger>
              <AccordionContent>
                <div className='mt-3 flex flex-col gap-5'>
                  {wordPOSsByForm.map((pos) => (
                    <WordPOSView
                      wordPOS={pos}
                      lemma={pos.lemma}
                      isSinglePOS={wordPOSsByForm.length === 1}
                      key={pos.id}
                    />
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
