import { proxy } from 'valtio';

export const appState = proxy({
  isWidgetActive: import.meta.env.MODE === 'development' ? true : false,
});

export const setIsWidgetActive = (isWidgetActive: boolean) => {
  appState.isWidgetActive = isWidgetActive;
};
