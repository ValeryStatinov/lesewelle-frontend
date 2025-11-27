import { proxy } from 'valtio';

import type { TokensGroupsMap, UIToken } from '../apiClient/endpoints/types/tokens';

export const interactiveTranslationState = proxy({
  uiTokens: [] as UIToken[],
  groupsMap: {} as TokensGroupsMap,
  selectedRootToken: undefined as UIToken | undefined,
});

export const setUITokens = (uiTokens: UIToken[]) => {
  interactiveTranslationState.uiTokens = uiTokens;
};

export const setGroupsMap = (groupsMap: TokensGroupsMap) => {
  interactiveTranslationState.groupsMap = groupsMap;
};

export const setSelectedRootToken = (selectedRootToken: UIToken | undefined) => {
  interactiveTranslationState.selectedRootToken = selectedRootToken;
};
