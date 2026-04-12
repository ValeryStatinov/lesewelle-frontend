import type { TargetLanguage } from 'core/lib/types/languages';

import { _apiClient } from '../registerApiClient';

import type { Id } from './types/basemodel';
import { type Paginator, searchParamsFromPaginator } from './types/paginator';
import type { WordsSet } from './types/sets';
import type { WordPOSWithLemma } from './types/words';

export type GetWordsSetsParams = {
  paginator: Paginator;
};

export type GetWordsSetsResponse = {
  ownedSets: WordsSet[];
};

export const apiGetWordsSets = async (params: GetWordsSetsParams) => {
  const searchParams = searchParamsFromPaginator(params.paginator);

  const response = await _apiClient.get<GetWordsSetsResponse>('/api/sets', {
    searchParams,
  });

  return response;
};

export type GetWordsSetWordsParams = {
  setId: Id;
  paginator: Paginator;
  lang: TargetLanguage;
};

export type GetWordsSetWordsResponse = {
  setWords: WordPOSWithLemma[];
};

export const apiGetWordsSetWords = async (params: GetWordsSetWordsParams) => {
  const searchParams = searchParamsFromPaginator(params.paginator);
  searchParams.append('lang', params.lang);

  const response = await _apiClient.get<GetWordsSetWordsResponse>(`/api/sets/${params.setId}/words`, {
    searchParams,
  });

  return response;
};

export type AddWordPOSToSetParams = {
  setId: Id;
  wordPOSId: Id;
};

export const apiAddWordPOSToSet = async (params: AddWordPOSToSetParams) => {
  await _apiClient.post(`/api/sets/${params.setId}/words`, {
    body: JSON.stringify({
      wordPosId: params.wordPOSId,
    }),
  });
};

export type DeleteWordPOSFromSetParams = {
  setId: Id;
  wordPOSId: Id;
};

export const apiDeleteWordPOSFromSet = async (params: DeleteWordPOSFromSetParams) => {
  await _apiClient.delete(`/api/sets/${params.setId}/words`, {
    body: JSON.stringify({
      wordPosId: params.wordPOSId,
    }),
  });
};
