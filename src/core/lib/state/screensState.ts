import { proxy } from 'valtio';

export type CurrentTab = 'settings' | 'dictionary' | undefined;

export const screensState = proxy({
  currentTab: undefined as CurrentTab,
});

export const setCurrentTab = (tab: CurrentTab) => {
  screensState.currentTab = tab;
};
