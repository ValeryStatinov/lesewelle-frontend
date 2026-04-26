import { useRef } from 'react';
import { useSnapshot } from 'valtio';

import { type AnalyzeDeResponse } from 'core/lib/apiClient';
import {
  interactiveTranslationState,
  setGroupsMap,
  setSelectedRootToken,
  setUITokens,
} from 'core/lib/state/interactiveTranslationState';
import { useApiErrorHandler } from 'core/lib/utils/useApiErrorHandler';
import { useEventCallback } from 'core/lib/utils/useEventCallback';

import { findSingleLogicalWordRoot } from './findSingleLogicalWordRoot';

type Params = {
  analyzeDEText: (text: string) => Promise<AnalyzeDeResponse>;
};

export const useUITokens = (params: Params) => {
  const { analyzeDEText } = params;

  const { uiTokens, groupsMap } = useSnapshot(interactiveTranslationState);

  const { apiErrorMessage, handleApiError, resetApiErrorMessage } = useApiErrorHandler();

  const abortControllerRef = useRef<AbortController | null>(null);

  const loadUITokens = useEventCallback(async (text: string) => {
    if (!text) {
      return;
    }

    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    setUITokens([]);
    setGroupsMap({});
    setSelectedRootToken(undefined);
    resetApiErrorMessage();

    try {
      const response = await analyzeDEText(text);

      setUITokens(response.tokens);
      setGroupsMap(response.groupsMap);

      // allow bottomsheet close animation to run
      setTimeout(() => {
        const singleWordRoot = findSingleLogicalWordRoot(response.tokens, response.groupsMap);
        if (singleWordRoot) {
          setSelectedRootToken(singleWordRoot);
        }
      }, 200);
    } catch (error) {
      handleApiError(error);
    }
  });

  return {
    uiTokens,
    groupsMap,
    loadUITokens,
    loadUITokensError: apiErrorMessage,
  };
};
