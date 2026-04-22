import type { NounGender, WordPOSTypeExtended } from 'core/lib/apiClient/endpoints/types/words';

import { articleByGender, humanReadableGenderShort, humanReadableWordPOSType } from './consts';

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatLemma = (lemma: string, gender?: NounGender) => {
  return !!gender ? `${articleByGender[gender]} ${capitalizeFirstLetter(lemma)}` : lemma;
};

export const formatPOSType = (posType: WordPOSTypeExtended, gender?: NounGender) => {
  const formatted = gender
    ? `${humanReadableWordPOSType[posType]} (${humanReadableGenderShort[gender]})`
    : humanReadableWordPOSType[posType];

  return formatted;
};
