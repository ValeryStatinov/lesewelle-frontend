import type { WithAbortSignal } from '../interfaces';
import { JsonStreamReader } from '../jsonStreamReader';
import { _apiClient } from '../registerApiClient';

import type { TokensGroupsMap, UIToken } from './types/tokens';

export type AnalyzeDeParams = {
  text: string;
};

export type AnalyzeDeResponse = {
  tokens: UIToken[];
  groupsMap: TokensGroupsMap;
};

export const apiAnalyzeDe = async (params: AnalyzeDeParams) => {
  const response = await _apiClient.post<AnalyzeDeResponse>('/api/nlp/analyze_de', {
    body: JSON.stringify(params),
  });

  return response;
};

export type TranslateWordParams = {
  word: string;
};

export type TranslateWordResponse = {
  translations: string[];
};

export const apiTranslateWord = async (params: TranslateWordParams) => {
  const response = await _apiClient.post<TranslateWordResponse>('/api/nlp/translate/word', {
    body: JSON.stringify(params),
  });

  return response;
};

export type TranslateTextParams = WithAbortSignal & {
  text: string;
  targetLanguage: string;
};

export type TranslateTextDeltaChunk = { delta: string };
export type TranslateTextErrorChunk = { error: string };
export type TranslateTextResponseChunk = TranslateTextDeltaChunk | TranslateTextErrorChunk;

export const apiTranslateTextStream = async (params: TranslateTextParams) => {
  const { signal, ...restParams } = params;

  // this endpoint streams jsons TranslateTextResponseChunk separated by new lines (golang json encoder inserts new lines)
  const reader = await _apiClient.postStream('/api/nlp/translate/text/stream', {
    body: JSON.stringify(restParams),
    signal,
  });
  const jsonStreamReader = new JsonStreamReader<TranslateTextResponseChunk>(reader);

  return jsonStreamReader;
};
