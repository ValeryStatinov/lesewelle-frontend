import { type FunctionComponent, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

import { cn } from 'core/lib/utils/cn';
import { useEventCallback } from 'core/lib/utils/useEventCallback';

type IsEmptyObject<T> = T extends Record<string, never> ? true : false;

export type AnimatedComponentRequiredProps = {
  onAnimationEnd: (event: React.AnimationEvent) => void;
  onTransitionEnd: (event: React.TransitionEvent) => void;
  className: string;
};

export type EmptyOwnProps = Record<string, never>;

type Props<T> = {
  show: boolean;
  onEnterClassName: string;
  onExitClassName: string;
  // data: T;
  // Component: FunctionComponent<AnimatedComponentProps<T>>;
  className?: string;
} & (IsEmptyObject<T> extends true
  ? { Component: FunctionComponent<AnimatedComponentRequiredProps> }
  : { Component: FunctionComponent<AnimatedComponentRequiredProps & T>; data: T });

/**
 * Do not forget to add `'transition'` css class or class with keyframes animation to animated component
 * or pass it to `className` prop.
 *
 * For better eslint and ts support always explicitly specify own props type:
 * ```
 * type OwnProps = { foo: string };
 * type Props = AnimatedComponentRequiredProps & OwnProps;
 * return <Animator<OwnProps> ... />
 * ```
 *
 * If Component has no additional props, `EmptyOwnProps` type can be used
 */
export const Animator = <T,>(props: Props<T>) => {
  const { show, onEnterClassName, onExitClassName, className } = props;

  const [isRendered, setIsRendered] = useState(show);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (show) {
      queueMicrotask(() => {
        flushSync(() => {
          setIsRendered(true);
        });
      });

      queueMicrotask(() => {
        setShouldAnimate(true);
      });

      return;
    }

    setShouldAnimate(false);
  }, [show]);

  const handleAnimationEnd = useEventCallback((event: React.AnimationEvent | React.TransitionEvent) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    if (!show) {
      setIsRendered(false);
    }
  });

  if (!isRendered) {
    return null;
  }

  const requiredProps: AnimatedComponentRequiredProps = {
    onAnimationEnd: handleAnimationEnd,
    onTransitionEnd: handleAnimationEnd,
    className: cn(className, shouldAnimate && show && onEnterClassName, !show && onExitClassName),
  };

  if ('data' in props) {
    return <props.Component {...props.data} {...requiredProps} />;
  }

  return <props.Component {...requiredProps} />;
};
