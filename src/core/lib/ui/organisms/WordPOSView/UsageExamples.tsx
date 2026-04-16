import type { WordUsageExample } from 'core/lib/apiClient/endpoints/types/words';
import type { WithClassName } from 'core/lib/types/common';
import { cn } from 'core/lib/utils/cn';

type Props = WithClassName & {
  usageExamples: WordUsageExample[];
};

export const UsageExamples = (props: Props) => {
  const { usageExamples, className } = props;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {usageExamples.map((example) => (
        <div
          key={example.id}
          className={`max-w-fit border-l-2 border-blue-200 bg-blue-50/50 py-1 pr-4 pl-2 text-sm text-stone-600 italic`}
        >
          {example.example}
        </div>
      ))}
    </div>
  );
};
