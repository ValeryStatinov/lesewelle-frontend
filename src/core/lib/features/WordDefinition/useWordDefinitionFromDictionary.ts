import { useMemo } from 'react';
import { useSnapshot } from 'valtio';

import { dictionaryState } from 'core/lib/state/dictionaryState';

import type { UseWordDefinitionsReturn, WordDefinitionEntry } from './types';

export const useWordDefinitionFromDictionary = (): UseWordDefinitionsReturn => {
  const dictionarySnapshot = useSnapshot(dictionaryState);

  const definitionsMap: Record<string, WordDefinitionEntry> = useMemo(() => {
    const pos = dictionarySnapshot.selectedWordPOS;

    if (!pos) {
      return {};
    }

    return {
      [pos.lemma]: {
        wordPOSsByLemma: [pos],
        wordPOSsByForm: [],
      },
    };
  }, [dictionarySnapshot.selectedWordPOS]);

  return {
    definitionsMap,
    error: undefined,
    loading: false,
  };
};
