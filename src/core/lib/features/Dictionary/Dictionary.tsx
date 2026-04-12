import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSnapshot } from 'valtio';

import type { Id } from 'core/lib/apiClient/endpoints/types/basemodel';
import type { Paginator } from 'core/lib/apiClient/endpoints/types/paginator';
import type { WordPOSWithLemma } from 'core/lib/apiClient/endpoints/types/words';
import { appState } from 'core/lib/state/appState';
import { dictionaryState, setSetWordsPaginatorPage } from 'core/lib/state/dictionaryState';
import type { TargetLanguage } from 'core/lib/types/languages';
import { Button } from 'core/lib/ui/atoms/Button/Button';
import { humanReadableWordPOSType } from 'core/lib/utils/consts';
import { capitalizeFirstLetter } from 'core/lib/utils/strings';
import { useIsScrolledToBottom } from 'core/lib/utils/useIsScrolledToBottom';

type DictionaryEntryProps = {
  wordPOS: WordPOSWithLemma;
  onDictionaryEntryClick: (wordPOS: WordPOSWithLemma) => void;
};

const DictionaryEntry = (props: DictionaryEntryProps) => {
  const { wordPOS, onDictionaryEntryClick } = props;

  const translations = wordPOS.translations.map((t) => t.translation).join(', ');
  const displayLemma = wordPOS.posType === 'NOUN' ? capitalizeFirstLetter(wordPOS.lemma) : wordPOS.lemma;
  const pos = wordPOS.nounProperties?.gender
    ? `${humanReadableWordPOSType[wordPOS.posType]} (${wordPOS.nounProperties.gender})`
    : humanReadableWordPOSType[wordPOS.posType];

  const handleClick = () => {
    onDictionaryEntryClick(wordPOS);
  };

  return (
    <button
      type='button'
      className={`
        w-full cursor-pointer flex-col rounded-sm p-1 text-left
        hover:bg-blue-50
      `}
      onClick={handleClick}
    >
      <div className='flex items-center gap-2'>
        <div className='font-bold'>{displayLemma}</div>
        <div className='text-sm'>{pos}</div>
      </div>
      <div className='truncate text-stone-400'>{translations}</div>
    </button>
  );
};

const Pagination = (props: { disabled: boolean }) => {
  const { disabled } = props;
  const { setWords } = useSnapshot(dictionaryState);
  const { paginator, data } = setWords;

  const currentPage = paginator.offset / paginator.limit + 1;
  const hasPrev = currentPage > 1;
  const hasNext = !!data && data.length >= paginator.limit;

  if (!hasPrev && !hasNext) {
    return null;
  }

  return (
    <div className='mt-1 flex items-center justify-end gap-1'>
      {hasPrev && (
        <Button
          variant='ghost'
          size='icon-sm'
          disabled={disabled}
          onClick={() => {
            setSetWordsPaginatorPage(currentPage - 1);
          }}
        >
          <ChevronLeft />
        </Button>
      )}
      {hasNext && (
        <Button
          variant='ghost'
          size='icon-sm'
          disabled={disabled}
          onClick={() => {
            setSetWordsPaginatorPage(currentPage + 1);
          }}
        >
          <ChevronRight />
        </Button>
      )}
    </div>
  );
};

type Props = {
  loadSetWords: (p: { setId: Id; lang: TargetLanguage; p: Paginator }) => Promise<WordPOSWithLemma[] | undefined>;
  onDictionaryEntryClick: (pos: WordPOSWithLemma) => void;
  onStudyClick: () => void;
  className?: string;
};

export const Dictionary = (props: Props) => {
  const { className, onDictionaryEntryClick, loadSetWords, onStudyClick } = props;

  const dictionarySnapshot = useSnapshot(dictionaryState);
  const appSnapshot = useSnapshot(appState);

  const [clickedStudy, setClickedStudy] = useState(false);
  const { ref: listRef, sentinelRef, isScrolledToBottom } = useIsScrolledToBottom<HTMLDivElement>();

  const handleStudyClick = () => {
    setClickedStudy(true);
    onStudyClick();
  };

  useEffect(() => {
    const load = async () => {
      if (!dictionarySnapshot.sets.defaultSet) {
        return;
      }

      await loadSetWords({
        setId: dictionarySnapshot.sets.defaultSet.id,
        lang: appSnapshot.targetTranslationLanguage,
        p: dictionarySnapshot.setWords.paginator,
      });
    };

    void load();
  }, [
    appSnapshot.targetTranslationLanguage,
    dictionarySnapshot.setWords.paginator,
    dictionarySnapshot.sets.defaultSet,
    loadSetWords,
  ]);

  return (
    <div className={className}>
      <h2 className='font-bold'>Dictionary</h2>

      <div className='relative mt-1 flex h-0 grow flex-col'>
        {!isScrolledToBottom && (
          <div
            className={`
              pointer-events-none absolute right-0 -bottom-px left-0 h-10 bg-linear-to-t from-white via-white/80
              to-transparent
            `}
          />
        )}
        <div ref={listRef} className='hide-scrollbar flex flex-1 flex-col overflow-auto'>
          {clickedStudy ? (
            <div className='mb-1 text-sm text-stone-400'>
              Just around the corner: <b>Spaced Repetition Learning!</b> This intelligent feature is under active
              development and will help to make memorization even more efficient. Stay tuned and keep{' '}
              <b>adding words</b>!
            </div>
          ) : (
            <Button onClick={handleStudyClick} className='mb-1 flex max-w-fit'>
              Study words with Spaced Repetition Learning
            </Button>
          )}

          {dictionarySnapshot.setWords.error && <div>{dictionarySnapshot.setWords.error}</div>}

          {dictionarySnapshot.setWords.data &&
            dictionarySnapshot.setWords.data.map((pos) => (
              <DictionaryEntry key={pos.id} wordPOS={pos} onDictionaryEntryClick={onDictionaryEntryClick} />
            ))}
          <div ref={sentinelRef} />
        </div>
      </div>

      <Pagination disabled={dictionarySnapshot.setWords.loading} />
    </div>
  );
};
