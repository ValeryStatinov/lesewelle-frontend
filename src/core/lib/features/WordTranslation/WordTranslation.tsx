import { useEffect, useState } from 'react';
import { BookMarked, BookmarkPlus, CircleX } from 'lucide-react';

import { Button } from 'core/lib/ui/atoms/Button/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'core/lib/ui/organisms/Select/Select';
import { cn } from 'core/lib/utils/cn';

export type Props = {
  translationsMap: Record<string, string[]>;
  loading: boolean;
  error: string | undefined;
  useDictionary: () => Record<string, string[]>;
  onClose: () => void;
  onAddToDictionary: (lemma: string, translations: string[]) => void;
  className?: string;
};

export const WordTranslation = (props: Props) => {
  const { useDictionary, translationsMap, loading, error, onClose, onAddToDictionary, className } = props;

  const firstLemma = Object.keys(translationsMap).length > 0 ? Object.keys(translationsMap)[0] : undefined;
  const [selectedLemma, setSelectedLemma] = useState<string | undefined>(firstLemma);
  const dictionary = useDictionary();

  const hasInDictionary = !!selectedLemma && !!dictionary[selectedLemma];

  useEffect(() => {
    const firstLemma = Object.keys(translationsMap).length > 0 ? Object.keys(translationsMap)[0] : undefined;
    setSelectedLemma(firstLemma);
  }, [loading, translationsMap]);

  const translations =
    selectedLemma && translationsMap[selectedLemma] ? translationsMap[selectedLemma].join(', ') : undefined;

  const handleLemmaChange = (lemma: string) => {
    setSelectedLemma(lemma);
  };

  const handleAddToDictionary = () => {
    if (hasInDictionary) {
      return;
    }

    if (!selectedLemma || !translationsMap[selectedLemma]) {
      return;
    }

    onAddToDictionary(selectedLemma, translationsMap[selectedLemma]);
  };

  return (
    <div className={cn('h-full w-full', className)}>
      <Button variant='ghost' size='icon-sm' onClick={onClose} className='absolute top-3 right-3'>
        <CircleX className='cursor-pointer' />
      </Button>
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}

      {!loading && !error && Object.keys(translationsMap).length > 0 && (
        <>
          <div className='flex items-center gap-1'>
            {Object.keys(translationsMap).length > 1 ? (
              <Select value={selectedLemma} onValueChange={handleLemmaChange}>
                <SelectTrigger className='p-0 text-lg font-bold'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='z-10' position='popper'>
                  {Object.keys(translationsMap).map((lemma) => (
                    <SelectItem key={lemma} value={lemma}>
                      {lemma}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className='flex h-9 items-center text-lg font-bold'>{selectedLemma}</div>
            )}

            <Button
              title={hasInDictionary ? 'Word is in your dictionary' : 'Add to my dictionary'}
              variant='ghost'
              size='icon-sm'
              onClick={handleAddToDictionary}
              className={cn(
                'justify-self-end',
                !hasInDictionary && 'cursor-pointer',
                hasInDictionary &&
                  `
                    cursor-default
                    hover:bg-transparent
                  `,
              )}
            >
              {hasInDictionary ? <BookMarked stroke='var(--color-blue-600)' /> : <BookmarkPlus />}
            </Button>
          </div>

          <div className='mt-1 text-sm text-stone-400'>Translations:</div>
          <div>{translations}</div>
        </>
      )}
    </div>
  );
};
