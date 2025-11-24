import { useMemo } from 'react';

import { type TokensGroupsMap, TokensGroupType, type UIToken } from 'core/lib/apiClient/endpoints/types/tokens';

import { NON_INTERACTIVE_POSs, NON_INTERACTIVE_TOKEN_ID, type RenderToken } from './types';

const computePressed = (uiToken: UIToken, groupsMap: TokensGroupsMap, selectedRootToken: UIToken | undefined) => {
  if (!selectedRootToken) {
    return false;
  }

  if (uiToken.id === selectedRootToken.id) {
    return true;
  }

  const fullVerbGroupId = selectedRootToken.groupIds.find(
    (id) => groupsMap[id].groupType === TokensGroupType.FULL_VERB,
  );
  if (!fullVerbGroupId) {
    return false;
  }

  const fullVerbGroup = groupsMap[fullVerbGroupId];
  if (fullVerbGroup.tokenIds.includes(uiToken.id)) {
    return true;
  }

  return false;
};

const computeHighlight = (uiToken: UIToken, hoveredToken: UIToken | undefined, groupsMap: TokensGroupsMap) => {
  if (!hoveredToken) {
    return false;
  }

  if (hoveredToken.id === uiToken.id) {
    return true;
  }

  if (hoveredToken.groupIds.length > 0) {
    const hoveredTokenGroups = hoveredToken.groupIds.map((groupId) => groupsMap[groupId]);

    const fullVerbGroup = hoveredTokenGroups.find((g) => g.groupType === TokensGroupType.FULL_VERB);

    if (fullVerbGroup && fullVerbGroup.tokenIds.includes(uiToken.id)) {
      return true;
    }
  }

  return false;
};

const eatWhitespaceChar = (str: string, index: number) => {
  const whitespaceRegex = /\s+/g;

  if (!whitespaceRegex.test(str[index])) {
    console.warn('Char is not whitespace', str[index]);
  }

  const renderToken: RenderToken = {
    text: str[index],
    highlight: false,
    pressed: false,
    uiTokenId: -1,
    id: index,
  };

  return renderToken;
};

type Params = {
  text: string;
  uiTokens: UIToken[];
  groupsMap: TokensGroupsMap;
  hoveredToken: UIToken | undefined;
  selectedRootToken: UIToken | undefined;
};

export const useRenderTokens = (params: Params) => {
  const { text, uiTokens, groupsMap, hoveredToken, selectedRootToken } = params;

  const renderTokens = useMemo(() => {
    const tokens: RenderToken[] = [];
    let currTextIndex = 0;

    for (const uiToken of uiTokens) {
      while (currTextIndex < uiToken.startChar) {
        tokens.push(eatWhitespaceChar(text, currTextIndex));
        currTextIndex++;
      }

      const renderToken: RenderToken = {
        text: uiToken.text,
        highlight: false,
        pressed: false,
        uiTokenId: uiToken.id,
        id: uiToken.startChar,
      };

      if (NON_INTERACTIVE_POSs.includes(uiToken.pos)) {
        renderToken.uiTokenId = NON_INTERACTIVE_TOKEN_ID;
      } else {
        const pressed = computePressed(uiToken, groupsMap, selectedRootToken);
        const highlight = pressed ? false : computeHighlight(uiToken, hoveredToken, groupsMap);

        renderToken.highlight = highlight;
        renderToken.pressed = pressed;
      }

      tokens.push(renderToken);
      currTextIndex = uiToken.endChar;
    }

    return tokens;
  }, [groupsMap, hoveredToken, selectedRootToken, text, uiTokens]);

  return {
    renderTokens,
  };
};
