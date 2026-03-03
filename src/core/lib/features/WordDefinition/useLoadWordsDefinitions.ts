import { useEffect, useRef, useState } from 'react';
import { useSnapshot } from 'valtio';

import type { WordsLookupReturn } from 'core/lib/apiClient';
import { type TokensGroupsMap, TokensGroupType, type UIToken } from 'core/lib/apiClient/endpoints/types/tokens';
import type { WordPOSType } from 'core/lib/apiClient/endpoints/types/words';
import { appState } from 'core/lib/state/appState';
import { interactiveTranslationState } from 'core/lib/state/interactiveTranslationState';
import type { TargetLanguage } from 'core/lib/types/languages';
import { useApiErrorHandler } from 'core/lib/utils/useApiErrorHandler';

import type { UseWordDefinitionsReturn, WordDefinitionEntry } from './types';

export type LoadWordsDefinitionsFn = (
  word: string,
  targetLanguage: TargetLanguage,
  pos: WordPOSType,
) => Promise<WordsLookupReturn>;

const getWordDefinitionPromises = (
  rootToken: UIToken,
  groupsMap: TokensGroupsMap,
  loadWordsDefinitions: LoadWordsDefinitionsFn,
  targetLanguage: TargetLanguage,
) => {
  const promises: { lemma: string; promise: Promise<WordsLookupReturn> }[] = [];

  if (!rootToken.groupIds) {
    promises.push({
      lemma: rootToken.lemma,
      promise: loadWordsDefinitions(rootToken.lemma, targetLanguage, rootToken.pos),
    });

    return promises;
  }

  const fullVerbGroupId = rootToken.groupIds.find((id) => groupsMap[id].groupType === TokensGroupType.FULL_VERB);
  if (!fullVerbGroupId) {
    promises.push({
      lemma: rootToken.lemma,
      promise: loadWordsDefinitions(rootToken.lemma, targetLanguage, rootToken.pos),
    });

    return promises;
  }

  const fullVerbGroup = groupsMap[fullVerbGroupId];
  promises.push({
    lemma: fullVerbGroup.groupLemma,
    promise: loadWordsDefinitions(fullVerbGroup.groupLemma, targetLanguage, rootToken.pos),
  });

  for (const groupId of rootToken.groupIds) {
    const group = groupsMap[groupId];
    if (group.groupLemma !== fullVerbGroup.groupLemma) {
      promises.push({
        lemma: group.groupLemma,
        promise: loadWordsDefinitions(group.groupLemma, targetLanguage, rootToken.pos),
      });
    }
  }

  return promises;
};

export const createLoadWordsDefinitionsHook = (loadWordsDefinitions: LoadWordsDefinitionsFn) => {
  const useLoadWordsDefinitions = (): UseWordDefinitionsReturn => {
    const { groupsMap, selectedRootToken } = useSnapshot(interactiveTranslationState);
    const { targetTranslationLanguage } = useSnapshot(appState);

    const [loading, setLoading] = useState(false);
    const [definitionsMap, setDefinitionsMap] = useState<Record<string, WordDefinitionEntry>>({});
    const { apiErrorMessage, handleApiError, resetApiErrorMessage } = useApiErrorHandler();
    const requestIndexRef = useRef(0);

    useEffect(() => {
      if (!selectedRootToken) {
        return;
      }

      const load = async () => {
        resetApiErrorMessage();
        setLoading(true);
        setDefinitionsMap({});

        const definitionPromises = getWordDefinitionPromises(
          selectedRootToken,
          groupsMap,
          loadWordsDefinitions,
          targetTranslationLanguage,
        );
        requestIndexRef.current++;
        const requestIndex = requestIndexRef.current;

        try {
          const responses = await Promise.all(definitionPromises.map((dp) => dp.promise));
          if (requestIndex !== requestIndexRef.current) {
            return;
          }

          const definitionsMap: Record<string, WordDefinitionEntry> = {};

          for (let i = 0; i < responses.length; i++) {
            const lemma = definitionPromises[i].lemma;
            const response = responses[i];
            definitionsMap[lemma] = { wordByLemma: response.wordByLemma, wordsByForms: response.wordsByForms };
          }

          setDefinitionsMap(definitionsMap);
          setLoading(false);
        } catch (error) {
          handleApiError(error);
          setLoading(false);
        }
      };

      void load();
    }, [groupsMap, handleApiError, resetApiErrorMessage, selectedRootToken, targetTranslationLanguage]);

    return {
      definitionsMap,
      loading,
      error: apiErrorMessage,
    };
  };

  return { useLoadWordsDefinitions };
};
