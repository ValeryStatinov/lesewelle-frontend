import {
  type TokensGroupId,
  type TokensGroupsMap,
  TokensGroupType,
  type UIToken,
} from 'core/lib/apiClient/endpoints/types/tokens';

import { NON_INTERACTIVE_POSs } from './types';

export const findSingleLogicalWordRoot = (uiTokens: UIToken[], groupsMap: TokensGroupsMap): UIToken | undefined => {
  const interactiveTokens = uiTokens.filter((t) => !NON_INTERACTIVE_POSs.includes(t.pos));
  if (interactiveTokens.length === 0) {
    return undefined;
  }

  const fullVerbGroupIds = new Set<TokensGroupId>();
  let standaloneCount = 0;

  for (const token of interactiveTokens) {
    const fullVerbGroupId = token.groupIds.find((id) => groupsMap[id]?.groupType === TokensGroupType.FULL_VERB);
    if (fullVerbGroupId) {
      fullVerbGroupIds.add(fullVerbGroupId);
    } else {
      standaloneCount++;
    }
  }

  if (standaloneCount + fullVerbGroupIds.size !== 1) {
    return undefined;
  }

  if (fullVerbGroupIds.size === 1) {
    const [groupId] = [...fullVerbGroupIds];
    return uiTokens.find((t) => t.id === groupsMap[groupId].rootTokenId);
  }

  return interactiveTokens[0];
};
