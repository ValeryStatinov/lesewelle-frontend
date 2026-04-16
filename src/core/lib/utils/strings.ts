import type { NounGender } from 'core/lib/apiClient/endpoints/types/words';

import { articleByGender } from './consts';

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatLemma = (lemma: string, gender?: NounGender) => {
  return !!gender ? `${articleByGender[gender]} ${capitalizeFirstLetter(lemma)}` : lemma;
};
