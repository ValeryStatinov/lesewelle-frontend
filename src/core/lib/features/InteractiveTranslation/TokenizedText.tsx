import type { Ref } from 'react';

import { cn } from 'core/lib/utils/cn';

import { Token } from './Token';
import type { RenderToken } from './types';

type Props = {
  renderTokens: RenderToken[];
  loadUITokensError: string | undefined;
  onMouseEnterToken: (token: RenderToken) => void;
  onClickToken: (token: RenderToken) => void;
  onMouseLeaveToken: () => void;
  onScroll: () => void;
  className?: string;
  ref?: Ref<HTMLDivElement>;
};

export const TokenizedText = (props: Props) => {
  const {
    renderTokens,
    loadUITokensError,
    onMouseEnterToken,
    onMouseLeaveToken,
    onClickToken,
    onScroll,
    className,
    ref,
  } = props;

  return (
    <div
      className={cn('hide-scrollbar overflow-x-hidden overflow-y-scroll whitespace-pre-line select-none', className)}
      ref={ref}
      onScroll={onScroll}
    >
      {renderTokens.length === 0 && (
        <div className='text-sm text-stone-400'>Try to select any German text on the webpage</div>
      )}

      {loadUITokensError && <div>{loadUITokensError}</div>}

      {!loadUITokensError &&
        renderTokens.map((token) => {
          return (
            <Token
              key={token.id}
              token={token}
              onMouseEnter={onMouseEnterToken}
              onMouseLeave={onMouseLeaveToken}
              onClick={onClickToken}
            />
          );
        })}
    </div>
  );
};
