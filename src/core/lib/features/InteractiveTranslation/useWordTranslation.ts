import { useEffect, useRef, useState } from 'react';

import type { TranslateWordResponse } from 'core/lib/apiClient';
import { type TokensGroupsMap, TokensGroupType, type UIToken } from 'core/lib/apiClient/endpoints/types/tokens';
import { useApiErrorHandler } from 'core/lib/utils/useApiErrorHandler';

type LoadWordTranslationFn = (word: string) => Promise<TranslateWordResponse>;

const getWordTranslationPromises = (
  rootToken: UIToken,
  groupsMap: TokensGroupsMap,
  loadWordTranslation: LoadWordTranslationFn,
) => {
  const promises: { lemma: string; promise: Promise<TranslateWordResponse> }[] = [];

  if (!rootToken.groupIds) {
    promises.push({
      lemma: rootToken.lemma,
      promise: loadWordTranslation(rootToken.lemma),
    });

    return promises;
  }

  const fullVerbGroupId = rootToken.groupIds.find((id) => groupsMap[id].groupType === TokensGroupType.FULL_VERB);
  if (!fullVerbGroupId) {
    promises.push({
      lemma: rootToken.lemma,
      promise: loadWordTranslation(rootToken.lemma),
    });

    return promises;
  }

  const fullVerbGroup = groupsMap[fullVerbGroupId];
  promises.push({
    lemma: fullVerbGroup.groupLemma,
    promise: loadWordTranslation(fullVerbGroup.groupLemma),
  });

  for (const groupId of rootToken.groupIds) {
    const group = groupsMap[groupId];
    if (group.groupLemma !== fullVerbGroup.groupLemma) {
      promises.push({
        lemma: group.groupLemma,
        promise: loadWordTranslation(group.groupLemma),
      });
    }
  }

  return promises;
};

type Params = {
  loadWordTranslation: (word: string) => Promise<TranslateWordResponse>;
  selectedRootToken: UIToken | undefined;
  groupsMap: TokensGroupsMap;
};

export const useWordTranslation = (params: Params) => {
  const { loadWordTranslation, selectedRootToken, groupsMap } = params;

  const [loading, setLoading] = useState(false);
  const [translationsMap, setTranslationsMap] = useState<Record<string, string[]>>({});
  const { apiErrorMessage, handleApiError, resetApiErrorMessage } = useApiErrorHandler();
  const requestIndexRef = useRef(0);

  useEffect(() => {
    if (!selectedRootToken) {
      return;
    }

    const load = async () => {
      resetApiErrorMessage();
      setLoading(true);
      setTranslationsMap({});

      const translationPromises = getWordTranslationPromises(selectedRootToken, groupsMap, loadWordTranslation);
      requestIndexRef.current++;
      const requestIndex = requestIndexRef.current;

      try {
        const responses = await Promise.all(translationPromises.map((tp) => tp.promise));
        if (requestIndex !== requestIndexRef.current) {
          return;
        }

        const translationsMap: Record<string, string[]> = {};

        for (let i = 0; i < responses.length; i++) {
          const lemma = translationPromises[i].lemma;
          const response = responses[i];
          translationsMap[lemma] = response.translations;
        }

        setTranslationsMap(translationsMap);
        setLoading(false);
      } catch (error) {
        handleApiError(error);
        setLoading(false);
      }
    };

    void load();
  }, [groupsMap, handleApiError, loadWordTranslation, resetApiErrorMessage, selectedRootToken]);

  return {
    loading,
    translationsMap,
    apiErrorMessage,
  };
};
