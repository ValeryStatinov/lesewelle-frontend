import { proxy } from 'valtio';

import { DEFAULT_PAGINATOR } from 'core/lib/apiClient/endpoints/types/paginator';
import { DEFAULT_SET_NAME, type WordsSet } from 'core/lib/apiClient/endpoints/types/sets';
import type { WordPOSWithLemma } from 'core/lib/apiClient/endpoints/types/words';

export const dictionaryState = proxy({
  sets: {
    data: undefined as WordsSet[] | undefined,
    error: undefined as string | undefined,
    loading: false,
    paginator: DEFAULT_PAGINATOR,
    get defaultSet() {
      if (!this.data || this.data.length === 0) {
        return undefined;
      }

      for (const s of this.data) {
        if (s.name === DEFAULT_SET_NAME) {
          return s;
        }
      }

      return undefined;
    },
  },

  setWords: {
    data: undefined as WordPOSWithLemma[] | undefined,
    error: undefined as string | undefined,
    loading: false,
    paginator: DEFAULT_PAGINATOR,
  },

  selectedWordPOS: undefined as WordPOSWithLemma | undefined,
});

export const setSelectedDictionaryWordPOS = (pos: WordPOSWithLemma | undefined) => {
  dictionaryState.selectedWordPOS = pos;
};

export const setSetsPaginatorPage = (page: number) => {
  const newPaginator = {
    limit: dictionaryState.sets.paginator.limit,
    offset: dictionaryState.sets.paginator.limit * (page - 1),
  };

  dictionaryState.sets.paginator = newPaginator;
};

export const setSetWordsPaginatorPage = (page: number) => {
  const newPaginator = {
    limit: dictionaryState.setWords.paginator.limit,
    offset: dictionaryState.setWords.paginator.limit * (page - 1),
  };

  dictionaryState.setWords.paginator = newPaginator;
};
