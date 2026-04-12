import { sendGetWordsSetsMessage, sendGetWordsSetWordsMessage } from 'core/chromeMessages/messages';
import { createDictionaryApiCallers } from 'core/lib/features/Dictionary/createDictionaryApiCalls';

const calls = createDictionaryApiCallers({
  rawLoadSets: sendGetWordsSetsMessage,
  rawLoadSetWords: sendGetWordsSetWordsMessage,
});

export const loadSets = calls.loadSets;
export const loadSetWords = calls.loadSetWords;
