import { cn } from 'core/lib/utils/cn';

import { NON_INTERACTIVE_TOKEN_ID, type RenderToken } from './types';

type Props = {
  token: RenderToken;
  onMouseEnter: (token: RenderToken) => void;
  onClick: (token: RenderToken) => void;
  onMouseLeave: () => void;
};

const commonStyles = cn(`
  relative transition-all duration-200
  before:absolute before:top-0 before:-left-0.5 before:h-full before:w-[calc(100%+0.250rem)] before:rounded-sm
  before:transition-all before:duration-200 before:content-[""]
`);

const highlightStyles = cn(`
  text-blue-600
  before:bg-blue-100
`);

const pressedStyles = cn(`
  text-white
  before:bg-blue-600
`);

export const Token = (props: Props) => {
  const { token, onMouseEnter, onMouseLeave, onClick } = props;

  const handleMouseEnter = () => {
    onMouseEnter(token);
  };

  const handleClick = () => {
    onClick(token);
  };

  if (token.uiTokenId === NON_INTERACTIVE_TOKEN_ID) {
    return <span>{token.text}</span>;
  }

  return (
    <button
      className={cn(commonStyles, token.highlight && highlightStyles, token.pressed && pressedStyles)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={handleClick}
    >
      <div className='relative'>{token.text}</div>
    </button>
  );
};
