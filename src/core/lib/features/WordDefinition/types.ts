import type { WordPOSWithLemma } from 'core/lib/apiClient/endpoints/types/words';

export type WordDefinitionEntry = {
  wordPOSsByLemma: WordPOSWithLemma[];
  wordPOSsByForm: WordPOSWithLemma[];
};

export type UseWordDefinitionsReturn = {
  definitionsMap: Record<string, WordDefinitionEntry>;
  loading: boolean;
  error: string | undefined;
};
