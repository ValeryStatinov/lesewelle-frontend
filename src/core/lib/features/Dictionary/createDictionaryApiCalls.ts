import { useSnapshot } from 'valtio';

import type { GetWordsSetsResponse, GetWordsSetWordsResponse } from 'core/lib/apiClient/endpoints/sets';
import type { Id } from 'core/lib/apiClient/endpoints/types/basemodel';
import type { Paginator } from 'core/lib/apiClient/endpoints/types/paginator';
import type { WordPOSWithLemma } from 'core/lib/apiClient/endpoints/types/words';
import { appState } from 'core/lib/state/appState';
import { dictionaryState } from 'core/lib/state/dictionaryState';
import { screensState } from 'core/lib/state/screensState';
import type { TargetLanguage } from 'core/lib/types/languages';
import { createApiCaller, useApiCaller } from 'core/lib/utils/apiCaller';

export type CreateDictionaryApiCallsParams = {
  rawLoadSets: (p: Paginator) => Promise<GetWordsSetsResponse>;
  rawLoadSetWords: (setId: Id, lang: TargetLanguage, p: Paginator) => Promise<GetWordsSetWordsResponse>;
};

export const createDictionaryApiCallers = (params: CreateDictionaryApiCallsParams) => {
  const loadSets = createApiCaller(async (p: Paginator) => {
    const response = await params.rawLoadSets(p);
    return response.ownedSets;
  }, dictionaryState.sets);

  const loadSetWords = createApiCaller(
    async ({ setId, lang, p }: { setId: Id; lang: TargetLanguage; p: Paginator }) => {
      const response = await params.rawLoadSetWords(setId, lang, p);
      return response.setWords;
    },
    dictionaryState.setWords,
  );

  return {
    loadSets,
    loadSetWords,
  };
};

export type UseWordPOSSetActionWithReloadParams = {
  loadSetWords: (args: { setId: Id; lang: TargetLanguage; p: Paginator }) => Promise<WordPOSWithLemma[] | undefined>;
  // add or delete
  action: (setId: Id, wordPOSId: Id) => Promise<void>;
};

export const useWordPOSSetActionWithReload = (params: UseWordPOSSetActionWithReloadParams) => {
  const dictionarySnapshot = useSnapshot(dictionaryState);
  const screensSnapshot = useSnapshot(screensState);
  const appSnapshot = useSnapshot(appState);
  const defaultSet = dictionarySnapshot.sets.defaultSet;

  const apiCaller = useApiCaller(async (args: { setId: Id; wordPOSId: Id }) => {
    await params.action(args.setId, args.wordPOSId);

    if (screensSnapshot.currentTab === 'dictionary' && defaultSet) {
      await params.loadSetWords({
        setId: defaultSet.id,
        lang: appSnapshot.targetTranslationLanguage,
        p: dictionarySnapshot.setWords.paginator,
      });
    }
  });

  return apiCaller;
};
