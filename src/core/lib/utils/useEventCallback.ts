import { useCallback, useRef } from 'react';

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

type Fn<Args extends unknown[], R> = (...args: Args) => R;

export const useEventCallback = <Args extends unknown[], R>(fn: Fn<Args, R>): Fn<Args, R> => {
  const ref = useRef<typeof fn>(() => {
    throw new Error('Cannot call an event handler while rendering.');
  });

  useIsomorphicLayoutEffect(() => {
    ref.current = fn;
  }, [fn]);

  return useCallback((...args: Args) => ref.current?.(...args), [ref]) as Fn<Args, R>;
};
