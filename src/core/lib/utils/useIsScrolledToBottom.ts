import { useEffect, useRef, useState } from 'react';

export const useIsScrolledToBottom = <T extends HTMLElement>() => {
  const containerRef = useRef<T>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const sentinel = sentinelRef.current;

    if (!container || !sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsScrolledToBottom(entry.isIntersecting);
      },
      { root: container, threshold: 0 },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, []);

  return {
    ref: containerRef,
    sentinelRef,
    isScrolledToBottom,
  };
};
