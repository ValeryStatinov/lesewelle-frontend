import type { Ref } from 'react';

import { cn } from 'core/lib/utils/cn';

type Props = {
  translatedText: string;
  translationError: string | undefined;
  loading: boolean;
  onScroll: () => void;
  className?: string;
  ref?: Ref<HTMLDivElement>;
};

export const TranslatedText = (props: Props) => {
  const { translatedText, translationError, loading, onScroll, className, ref } = props;

  return (
    <div
      className={cn('hide-scrollbar overflow-x-hidden overflow-y-scroll whitespace-pre-line select-none', className)}
      ref={ref}
      onScroll={onScroll}
    >
      {!translatedText && !translationError && !loading && (
        <div className='text-sm text-stone-400'>Here you will see the translation of the selected text</div>
      )}
      {loading && <div className='text-sm text-stone-400'>Loading...</div>}

      {translationError || translatedText}
    </div>
  );
};
