import { useRef } from 'react';
import { appState } from 'content/state/appState';
import { useSnapshot } from 'valtio';

import { sendAnalyzeTextDeMessage, sendTranslateWordMessage } from 'core/chromeMessages/messages';
import { InteractiveTranslation } from 'core/lib/features/InteractiveTranslation/InteractiveTranslation';
import { useTranslatedTextExt } from 'core/lib/features/InteractiveTranslation/useTranslatedTextExt';

import { Header } from './Header';
import { useDraggableWidget } from './useDraggableWidget';

export const AppShell = () => {
  const dragHandleRef = useRef<HTMLButtonElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { isWidgetActive, isTextTranslationEnabled } = useSnapshot(appState);

  useDraggableWidget({
    dragHandleRef,
    draggableElementRef: containerRef,
    isWidgetActive,
  });

  if (!isWidgetActive) {
    return null;
  }

  return (
    <div ref={containerRef} className={`fixed top-0 left-0 z-99999 h-[500px] max-h-screen w-[380px]`}>
      <main className='flex h-full flex-col rounded-sm bg-white p-2 text-sm drop-shadow-lg'>
        <Header dragHandleRef={dragHandleRef} />
        <InteractiveTranslation
          analyzeDEText={sendAnalyzeTextDeMessage}
          translateWord={sendTranslateWordMessage}
          useTranslatedText={useTranslatedTextExt}
          isTextTranslationEnabled={isTextTranslationEnabled}
          className='mt-2'
        />
      </main>
    </div>
  );
};
