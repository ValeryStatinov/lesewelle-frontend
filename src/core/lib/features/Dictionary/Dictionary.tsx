import { useState } from 'react';

import { Button } from 'core/lib/ui/atoms/Button/Button';

type DictionaryEntryProps = {
  lemma: string;
  translations: string[];
  onDictionaryEntryClick: (lemma: string) => void;
};

const DictionaryEntry = (props: DictionaryEntryProps) => {
  const { lemma, translations, onDictionaryEntryClick } = props;

  const joinedTranslations = translations.join(', ');

  const handleClick = () => {
    onDictionaryEntryClick(lemma);
  };

  return (
    <button
      type='button'
      className={`
        flex w-full flex-1 cursor-pointer flex-col rounded-sm p-1 text-left
        hover:bg-blue-50
      `}
      onClick={handleClick}
    >
      <div>{lemma}</div>
      <div className='truncate text-stone-400'>{joinedTranslations}</div>
    </button>
  );
};

type Props = {
  useDictionary: () => Record<string, string[]>;
  onDictionaryEntryClick: (lemma: string) => void;
  onStudyClick: () => void;
  className?: string;
};

export const Dictionary = (props: Props) => {
  const { useDictionary, className, onDictionaryEntryClick, onStudyClick } = props;

  const dictionary = useDictionary();
  const [clickedStudy, setClickedStudy] = useState(false);

  const handleStudyClick = () => {
    setClickedStudy(true);
    onStudyClick();
  };

  return (
    <div className={className}>
      <h2 className='font-bold'>Dictionary</h2>

      <div className='hide-scrollbar mt-1 flex h-0 grow flex-col overflow-auto'>
        {clickedStudy ? (
          <div className='mb-1 text-sm text-stone-400'>
            Just around the corner: <b>Spaced Repetition Learning!</b> This intelligent feature is under active
            development and will help to make memorization even more efficient. Stay tuned and keep <b>adding words</b>!
          </div>
        ) : (
          <Button onClick={handleStudyClick} className='mb-1 flex max-w-fit'>
            Study words with Spaced Repetition Learning
          </Button>
        )}

        {Object.keys(dictionary).map((lemma) => (
          <DictionaryEntry
            key={lemma}
            lemma={lemma}
            translations={dictionary[lemma]}
            onDictionaryEntryClick={onDictionaryEntryClick}
          />
        ))}
      </div>
    </div>
  );
};
