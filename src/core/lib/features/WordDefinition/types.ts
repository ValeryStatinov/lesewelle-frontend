import type { Word } from 'core/lib/apiClient/endpoints/types/words';

export type WordDefinitionEntry = {
  wordByLemma: Word | undefined;
  wordsByForms: Word[];
};

export type UseWordDefinitionsReturn = {
  definitionsMap: Record<string, WordDefinitionEntry>;
  loading: boolean;
  error: string | undefined;
};
