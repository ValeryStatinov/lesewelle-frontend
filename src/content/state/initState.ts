import { initDictionaryState } from './dictionaryState';
import { initAppState } from './initAppState';

export const initState = async () => {
  await Promise.all([initAppState(), initDictionaryState()]);
};
