import { type RefObject, useRef } from 'react';

import { useEventCallback } from 'core/lib/utils/useEventCallback';

export const useSyncScroll = () => {
  const originalRef = useRef<HTMLDivElement>(null);
  const translatedRef = useRef<HTMLDivElement>(null);
  const syncingRef = useRef(false);

  const handleScroll = useEventCallback(
    (sourceRef: RefObject<HTMLDivElement | null>, targetRef: RefObject<HTMLDivElement | null>) => {
      if (syncingRef.current) return;

      syncingRef.current = true;

      const sourceEl = sourceRef.current;
      const targetEl = targetRef.current;

      if (sourceEl && targetEl) {
        const scrollPercentage = sourceEl.scrollTop / (sourceEl.scrollHeight - sourceEl.clientHeight);
        targetEl.scrollTop = scrollPercentage * (targetEl.scrollHeight - targetEl.clientHeight);
      }

      setTimeout(() => {
        syncingRef.current = false;
      }, 10);
    },
  );

  return {
    originalRef,
    translatedRef,
    handleScroll,
  };
};
