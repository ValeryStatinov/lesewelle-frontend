import type { TargetLanguage } from 'core/lib/types/languages';

import type { WithAbortSignal } from '../interfaces';
import { JsonStreamReader } from '../jsonStreamReader';
import { _apiClient } from '../registerApiClient';

import type { TokensGroupsMap, UIToken } from './types/tokens';
import type { Word, WordPOSType, WordPOSWithLemma } from './types/words';

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
  const reader = await _apiClient.postStream('/api/stream/nlp/translate/text', {
    body: JSON.stringify(restParams),
    signal,
  });
  const jsonStreamReader = new JsonStreamReader<TranslateTextResponseChunk>(reader);

  return jsonStreamReader;
};

export type WordsLookupParams = {
  word: string;
  targetLanguage: TargetLanguage;
  pos?: WordPOSType;
};

export type WordsLookupResponse = {
  wordByLemma: Word;
  wordsByForms: Word[];
};

export type WordsLookupReturn = {
  wordPOSsByLemma: WordPOSWithLemma[];
  wordPOSsByForm: WordPOSWithLemma[];
};

export const apiWordsLookup = async (params: WordsLookupParams) => {
  const response = await _apiClient.post<WordsLookupResponse>('/api/nlp/words/lookup', {
    body: JSON.stringify(params),
  });

  const result: WordsLookupReturn = {
    wordPOSsByLemma: [],
    wordPOSsByForm: [],
  };

  for (const pos of response.wordByLemma.wordPOSs) {
    const posWithLemma: WordPOSWithLemma = {
      ...pos,
      lemma: response.wordByLemma.word,
    };

    result.wordPOSsByLemma.push(posWithLemma);
  }

  for (const w of response.wordsByForms) {
    for (const pos of w.wordPOSs) {
      const posWithLemma: WordPOSWithLemma = {
        ...pos,
        lemma: w.word,
      };

      result.wordPOSsByForm.push(posWithLemma);
    }
  }

  return result;
};
