import { _apiClient } from '../registerApiClient';

export type TokensGroupId = string;

export enum TokensGroupType {
  FULL_VERB = 'FULL_VERB',
  REFLEXIVE_VERB = 'REFLEXIVE_VERB',
  WITH_FIXED_PREPOSITION_VERB = 'WITH_FIXED_PREPOSITION_VERB',
  SEPARABLE_PREFIX_VERB = 'SEPARABLE_PREFIX_VERB',
}

export type TokensGroup = {
  id: TokensGroupId;
  groupType: TokensGroupType;
  rootTokenId: number;
  tokenIds: number[];
  groupLemma: string;
};

export type UITokenId = number;

export type UIToken = {
  id: UITokenId;
  text: string;
  lemma: string;
  pos: string;
  tag: string;
  dep: string;
  groupIds: TokensGroupId[];
  startChar: number;
  endChar: number;
};

export type AnalyzeDeParams = {
  text: string;
};

export type AnalyzeDeResponse = {
  tokens: UIToken[];
  groupsMap: TokensGroup[];
};

export const apiAnalyzeDe = async (params: AnalyzeDeParams) => {
  const response = await _apiClient.post<AnalyzeDeResponse>('/api/nlp/analyze_de', {
    body: JSON.stringify(params),
  });

  return response;
};
