import type { WithClassName } from 'core/lib/types/common';
import { cn } from 'core/lib/utils/cn';

type Props = WithClassName & {
  onClick?: () => void;
};

export const Backdrop = (props: Props) => {
  const { onClick, className } = props;

  return (
    <div className={cn('fixed top-0 left-0 min-h-dvh min-w-dvw bg-black opacity-70', className)} onClick={onClick} />
  );
};
