import type { PropsWithChildren } from 'react';

import { cn } from 'core/lib/utils/cn';

type Props = {
  className?: string;
};

export const LemmaTag = (props: PropsWithChildren<Props>) => {
  const { children, className } = props;

  return (
    <span
      className={cn(
        'relative inline-block truncate rounded-md bg-blue-600 px-2 py-0.5 font-medium text-white',
        className,
      )}
    >
      {children}
    </span>
  );
};
