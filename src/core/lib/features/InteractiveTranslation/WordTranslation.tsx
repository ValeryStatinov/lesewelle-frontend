import { CircleX } from 'lucide-react';

import { Button } from 'core/lib/ui/atoms/Button/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'core/lib/ui/organisms/Tabs/Tabs';
import { cn } from 'core/lib/utils/cn';

const TrabslationTabs = ({ translationsMap }: { translationsMap: Record<string, string[]> }) => {
  const defaultTabsValue = Object.keys(translationsMap).length > 0 ? Object.keys(translationsMap)[0] : '';

  return (
    <Tabs defaultValue={defaultTabsValue} className='w-full'>
      <TabsList>
        {Object.keys(translationsMap).map((lemma) => {
          return (
            <TabsTrigger key={lemma} value={lemma} className='text-lg font-bold'>
              {lemma}
            </TabsTrigger>
          );
        })}
      </TabsList>

      {Object.entries(translationsMap).map(([lemma, translations]) => {
        return (
          <TabsContent key={lemma} value={lemma}>
            <div className='text-sm text-stone-400'>Translations:</div>
            {translations.join(', ')}
          </TabsContent>
        );
      })}
    </Tabs>
  );
};

type Props = {
  show: boolean;
  translationsMap: Record<string, string[]>;
  loading: boolean;
  error: string | undefined;
  onClose: () => void;
  className?: string;
};

export const WordTranslation = (props: Props) => {
  const { show, translationsMap, loading, error, onClose, className } = props;

  const renderTabs = Object.keys(translationsMap).length > 1;
  const firstLemma = Object.keys(translationsMap).length > 0 ? Object.keys(translationsMap)[0] : undefined;
  const firstLemmaTranslations = firstLemma ? translationsMap[firstLemma].join(', ') : undefined;

  const content = renderTabs ? (
    <TrabslationTabs translationsMap={translationsMap} />
  ) : (
    <div>
      <div className='text-lg font-bold'>{firstLemma}</div>
      <div className='mt-1 text-sm text-stone-400'>Translations:</div>
      <div>{firstLemmaTranslations}</div>
    </div>
  );

  return (
    <div
      className={cn(
        'absolute top-full left-0 h-[calc(52%+8px)] w-full bg-white p-3 transition-all',
        'shadow-[0_0_8px_rgba(0,0,0,0.25)]',
        show && 'top-[48%]',
        className,
      )}
    >
      <Button variant='ghost' size='icon-sm' onClick={onClose} className='absolute top-3 right-3'>
        <CircleX className='cursor-pointer' />
      </Button>
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}

      {!loading && !error && Object.keys(translationsMap).length > 0 && content}
    </div>
  );
};
