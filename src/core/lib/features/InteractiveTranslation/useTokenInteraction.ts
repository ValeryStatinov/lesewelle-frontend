import { useEffect, useState } from 'react';
import { useSnapshot } from 'valtio';

import { type TokensGroupsMap, TokensGroupType, type UIToken } from 'core/lib/apiClient/endpoints/types/tokens';
import { interactiveTranslationState, setSelectedRootToken } from 'core/lib/state/interactiveTranslationState';
import { useEventCallback } from 'core/lib/utils/useEventCallback';

import { NON_INTERACTIVE_TOKEN_ID, type RenderToken } from './types';

type Params = {
  uiTokens: UIToken[];
  groupsMap: TokensGroupsMap;
};

export const useTokenInteraction = (params: Params) => {
  const { uiTokens, groupsMap } = params;

  const [hoveredToken, setHoveredToken] = useState<UIToken | undefined>(undefined);
  const { selectedRootToken } = useSnapshot(interactiveTranslationState);

  useEffect(() => {
    if (uiTokens.length === 0) {
      setHoveredToken(undefined);
      setSelectedRootToken(undefined);
    }
  }, [uiTokens.length]);

  const handleMouseEnterToken = useEventCallback((token: RenderToken) => {
    if (token.uiTokenId === NON_INTERACTIVE_TOKEN_ID) {
      setHoveredToken(undefined);

      return;
    }

    const uiToken = uiTokens.find((t) => t.id === token.uiTokenId);
    setHoveredToken(uiToken);
  });

  const handleMouseLeaveToken = useEventCallback(() => {
    setHoveredToken(undefined);
  });

  const handleClickToken = useEventCallback((token: RenderToken) => {
    if (token.uiTokenId === NON_INTERACTIVE_TOKEN_ID) {
      setSelectedRootToken(undefined);
      return;
    }

    const uiToken = uiTokens.find((t) => t.id === token.uiTokenId);
    if (!uiToken) {
      console.error('UI token not found');

      setSelectedRootToken(undefined);
      return;
    }

    const fullVerbGroupId = uiToken.groupIds.find((id) => groupsMap[id].groupType === TokensGroupType.FULL_VERB);
    if (!fullVerbGroupId) {
      setSelectedRootToken(uiToken);

      return;
    }

    const rootUITokenId = groupsMap[fullVerbGroupId].rootTokenId;
    const rootUIToken = uiTokens.find((t) => t.id === rootUITokenId);
    if (!rootUIToken) {
      console.error('Root ui token not found');
      setSelectedRootToken(undefined);

      return;
    }

    setSelectedRootToken(rootUIToken);
  });

  return {
    hoveredToken,
    selectedRootToken,
    handleMouseEnterToken,
    handleMouseLeaveToken,
    handleClickToken,
  };
};
