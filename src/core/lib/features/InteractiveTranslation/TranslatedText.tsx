import { cn } from 'core/lib/utils/cn';

type Props = {
  translatedText: string;
  translationError: string | undefined;
  loading: boolean;
  className?: string;
};

export const TranslatedText = (props: Props) => {
  const { translatedText, translationError, loading, className } = props;

  return (
    <div
      className={cn('hide-scrollbar overflow-x-hidden overflow-y-scroll whitespace-pre-line select-none', className)}
    >
      {!translatedText && !translationError && !loading && (
        <div className='text-sm text-stone-400'>Here you will see the translation of the selected text</div>
      )}
      {loading && <div className='text-sm text-stone-400'>Loading...</div>}

      {translationError || translatedText}
    </div>
  );
};
