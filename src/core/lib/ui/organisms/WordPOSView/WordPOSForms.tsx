import { useMemo } from 'react';

import type { WordForm } from 'core/lib/apiClient/endpoints/types/words';
import { cn } from 'core/lib/utils/cn';

import { convertToRenderFormGroups } from './convertWordForms';

type Props = {
  forms: WordForm[];
  className?: string;
};

export const WordPOSForms = (props: Props) => {
  const { forms, className } = props;
  const groups = useMemo(() => convertToRenderFormGroups(forms), [forms]);

  return (
    <div className={cn('flex flex-col gap-5', className)}>
      {groups.map((group, groupIndex) => (
        <div key={groupIndex}>
          <h3 className='mb-2 text-xs font-bold tracking-wide text-gray-900 uppercase'>{group.group}</h3>
          <div
            className={cn(
              'flex flex-col gap-y-1 border-l-2 border-gray-200 pl-3',
              group.forms.length >= 6 && 'grid grid-cols-2 gap-x-5',
            )}
          >
            {group.forms.map((form, formIndex) => (
              <div key={formIndex} className='leading-relaxed'>
                {form.label ? (
                  <div>
                    <span className='text-sm text-gray-400'>{form.label}</span>
                    <span className='text-sm text-gray-400'> · </span>
                    <span className='text-sm text-gray-900'>{form.formString}</span>
                  </div>
                ) : (
                  <span className='text-sm text-gray-900'>{form.formString}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
