import { useRef } from 'react';
import { appState } from 'content/state/appState';
import { useSnapshot } from 'valtio';

import { Header } from './Header';
import { useDraggableWidget } from './useDraggableWidget';

export const AppShell = () => {
  const dragHandleRef = useRef<HTMLButtonElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { isWidgetActive } = useSnapshot(appState);

  useDraggableWidget({
    dragHandleRef,
    draggableElementRef: containerRef,
    isWidgetActive,
  });

  if (!isWidgetActive) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`
        fixed top-0 left-0 z-99999 h-[500px] max-h-screen w-[380px] border-2 border-solid border-red-600 bg-white
      `}
    >
      <Header dragHandleRef={dragHandleRef} />

      <main>Hello world {EXT_VERSION}</main>
    </div>
  );
};
