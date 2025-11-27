import { proxy, snapshot, useSnapshot } from 'valtio';

import { persistenceManager } from 'background/persistence/persistenceManager';

import { DICTIONARY_KEY } from './consts';

export const dictionaryState = proxy({
  selectedLemma: undefined as string | undefined,
  dictionary: {} as Record<string, string[]>,
});

export const initDictionaryState = async () => {
  let dictionary = await persistenceManager.getItem<Record<string, string[]>>(DICTIONARY_KEY);
  if (!dictionary) {
    dictionary = {};
  }

  dictionaryState.dictionary = dictionary;
};

export const addToDictionary = async (lemma: string, translations: string[]) => {
  dictionaryState.dictionary[lemma] = translations;

  const plainObject = snapshot(dictionaryState.dictionary);

  await persistenceManager.setItem(DICTIONARY_KEY, plainObject);
};

export const removeFromDictionary = async (lemma: string) => {
  if (dictionaryState.dictionary[lemma]) {
    delete dictionaryState.dictionary[lemma];
  }

  const plainObject = snapshot(dictionaryState);

  await persistenceManager.setItem(DICTIONARY_KEY, plainObject);
};

export const setSelectedLemma = (lemma: string | undefined) => {
  dictionaryState.selectedLemma = lemma;
};

export const useDictionarySnapshot = () => {
  const { dictionary } = useSnapshot(dictionaryState);

  return dictionary;
};

export const useWordTranslationsDictionary = () => {
  const dictionary = useDictionarySnapshot();
  const { selectedLemma } = useSnapshot(dictionaryState);
  if (!selectedLemma) {
    return {
      translationsMap: {},
      loading: false,
      error: 'No dictionary entry selected',
    };
  }

  const translationsMap = {
    [selectedLemma]: dictionary[selectedLemma],
  };

  return {
    translationsMap,
    loading: false,
    error: undefined,
  };
};
