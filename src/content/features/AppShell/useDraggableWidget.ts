import { type RefObject, useEffect } from 'react';
import throttle from 'lodash/throttle';

type Params = {
  dragHandleRef: RefObject<HTMLElement | null>;
  draggableElementRef: RefObject<HTMLElement | null>;
  isWidgetActive: boolean;
};

export const useDraggableWidget = (params: Params) => {
  const { dragHandleRef, draggableElementRef, isWidgetActive } = params;

  useEffect(() => {
    if (!isWidgetActive) {
      return;
    }

    if (!dragHandleRef.current || !draggableElementRef.current) {
      return;
    }

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    const dragHandle = dragHandleRef.current;
    const draggableElement = draggableElementRef.current;

    const setInitialPosition = () => {
      const x = document.body.offsetWidth - draggableElement.offsetWidth;
      const y = document.body.offsetHeight / 8;

      draggableElement.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`;
    };

    setInitialPosition();

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.composedPath()[0];

      if (target !== dragHandle) {
        return;
      }

      e.preventDefault();
      isDragging = true;

      const rect = draggableElement.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;

      dragHandle.style.cursor = 'grabbing';
    };

    const handleMouseMove = throttle((e: MouseEvent) => {
      if (!isDragging) {
        return;
      }

      const newX = e.clientX - offsetX;
      const newY = e.clientY - offsetY;

      const maxX = document.body.offsetWidth - draggableElement.offsetWidth;
      const maxY = document.body.offsetHeight - draggableElement.offsetHeight;

      const constrainedX = Math.max(0, Math.min(newX, maxX));
      const constrainedY = Math.max(0, Math.min(newY, maxY));

      draggableElement.style.transform = `translate(${constrainedX.toFixed(2)}px, ${constrainedY.toFixed(2)}px)`;
    }, 10);

    const handleMouseUp = () => {
      isDragging = false;
      dragHandle.style.cursor = 'grab';
    };

    dragHandle.addEventListener('mousedown', handleMouseDown);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      dragHandle.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggableElementRef, dragHandleRef, isWidgetActive]);
};
