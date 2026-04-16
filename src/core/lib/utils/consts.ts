import type { NounGender, WordPOSTypeExtended } from 'core/lib/apiClient/endpoints/types/words';

export const SOMETHING_WENT_WRONG = 'Something went wrong...';

export const humanReadableWordPOSType: Record<WordPOSTypeExtended, string> = {
  ADJ: 'Adjective',
  ADP: 'Adposition',
  ADV: 'Adverb',
  AUX: 'Auxiliary verb',
  CCONJ: 'Coordinating conjunction',
  INTJ: 'Interjection',
  NOUN: 'Noun',
  NUM: 'Numeral',
  PART: 'Particle',
  PRON: 'Pronoun',
  PROPN: 'Proper noun',
  PUNCT: 'Punctuation',
  SCONJ: 'Subordinating conjunction',
  SYM: 'Symbol',
  VERB: 'Verb',
  X: 'Other',
  DET: 'Determiner',
  DEFINITE_ARTICLE: 'Definite article',
  INDEFINITE_ARTICLE: 'Indefinite article',
  DEMONSTRATIVE: 'Demonstrative',
  POSSESSIVE: 'Possessive pronoun',
};

export const articleByGender: Record<NounGender, string> = {
  neuter: 'das',
  feminine: 'die',
  masculine: 'der',
};
