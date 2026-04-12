import type { TargetLanguage } from 'core/lib/types/languages';

import type { BaseModel } from './basemodel';

export type WordPOSType =
  | 'ADJ'
  | 'ADP'
  | 'ADV'
  | 'AUX'
  | 'CCONJ'
  | 'INTJ'
  | 'NOUN'
  | 'NUM'
  | 'PART'
  | 'PRON'
  | 'PROPN'
  | 'PUNCT'
  | 'SCONJ'
  | 'SYM'
  | 'VERB'
  | 'X'
  | 'DET';

export type WordPOSTypeExtension = 'DEFINITE_ARTICLE' | 'INDEFINITE_ARTICLE' | 'DEMONSTRATIVE' | 'POSSESSIVE';

export type WordPOSTypeExtended = WordPOSType | WordPOSTypeExtension;

export type WordTranslation = BaseModel & {
  language: TargetLanguage;
  translation: string;
};

export type WordUsageExample = BaseModel & {
  example: string;
};

export type VerbProperties = BaseModel & {
  auxVerb: string;
};

export enum NounGender {
  Masculine = 'masculine',
  Feminine = 'feminine',
  Neuter = 'neuter',
}

export type NounProperties = BaseModel & {
  gender: NounGender;
};

export enum WordFormType {
  FormTypeVerbPartizip1 = 'verb:partizip1',
  FormTypeVerbPartizip2 = 'verb:partizip2',

  // verbs
  FormTypeConjugatablePrasensIch = 'conjugatable:prasens:ich',
  FormTypeConjugatablePrasensDu = 'conjugatable:prasens:du',
  FormTypeConjugatablePrasensErSieEs = 'conjugatable:prasens:er/sie/es',
  FormTypeConjugatablePrasensIhr = 'conjugatable:prasens:ihr',
  FormTypeConjugatablePrasensWir = 'conjugatable:prasens:wir',
  FormTypeConjugatablePrasensSie = 'conjugatable:prasens:sie/Sie',

  FormTypePrateritumPrasensIch = 'conjugatable:prateritum:ich',
  FormTypePrateritumPrasensDu = 'conjugatable:prateritum:du',
  FormTypePrateritumPrasensErSieEs = 'conjugatable:prateritum:er/sie/es',
  FormTypePrateritumPrasensIhr = 'conjugatable:prateritum:ihr',
  FormTypePrateritumPrasensWir = 'conjugatable:prateritum:wir',
  FormTypePrateritumPrasensSie = 'conjugatable:prateritum:sie/Sie',

  FormTypeKonjunktiv2PrasensIch = 'conjugatable:konjunktiv2:ich',
  FormTypeKonjunktiv2PrasensDu = 'conjugatable:konjunktiv2:du',
  FormTypeKonjunktiv2PrasensErSieEs = 'conjugatable:konjunktiv2:er/sie/es',
  FormTypeKonjunktiv2PrasensIhr = 'conjugatable:konjunktiv2:ihr',
  FormTypeKonjunktiv2PrasensWir = 'conjugatable:konjunktiv2:wir',
  FormTypeKonjunktiv2PrasensSie = 'conjugatable:konjunktiv2:sie/Sie',

  // nouns,
  // (in)definite articles, der/die/das ein/eine
  // negative article, kein/keine
  // demonstrative article, dieser/jener/jeder
  // possesive pronoun, mein/dein
  // quantifiers, alle/einige/manche
  FormTypeDeclinatableNomMasculine = 'declinatable:nominativ:masculine',
  FormTypeDeclinatableNomNeuter = 'declinatable:nominativ:neuter',
  FormTypeDeclinatableNomFeminine = 'declinatable:nominativ:feminine',
  FormTypeDeclinatableNomPlural = 'declinatable:nominativ:plural',
  FormTypeDeclinatableAkkMasculine = 'declinatable:akkusativ:masculine',
  FormTypeDeclinatableAkkNeuter = 'declinatable:akkusativ:neuter',
  FormTypeDeclinatableAkkFeminine = 'declinatable:akkusativ:feminine',
  FormTypeDeclinatableAkkPlural = 'declinatable:akkusativ:plural',
  FormTypeDeclinatableDatMasculine = 'declinatable:dativ:masculine',
  FormTypeDeclinatableDatNeuter = 'declinatable:dativ:neuter',
  FormTypeDeclinatableDatFeminine = 'declinatable:dativ:feminine',
  FormTypeDeclinatableDatPlaral = 'declinatable:dativ:plural',
  FormTypeDeclinatableGenMasculine = 'declinatable:genitiv:masculine',
  FormTypeDeclinatableGenNeuter = 'declinatable:genitiv:neuter',
  FormTypeDeclinatableGenFeminine = 'declinatable:genitiv:feminine',
  FormTypeDeclinatableGenPlural = 'declinatable:genitiv:plural',

  FormTypeNounNomSingular = 'noun:nominativ:singular',
  FormTypeNounNomPlural = 'noun:nominativ:plural',
  FormTypeNounAkkSingular = 'noun:akkusativ:singular',
  FormTypeNounAkkPlural = 'noun:akkusativ:plural',
  FormTypeNounDatSingular = 'noun:dativ:singular',
  FormTypeNounDatPlural = 'noun:dativ:plural',
  FormTypeNounGenSingular = 'noun:genitiv:singular',
  FormTypeNounGenPlural = 'noun:genitiv:plural',

  // reflexive pronoun, sich
  // personal pronoun, ich/du/er/sie/es/wir/ihr/sie
  FormTypeCaseOnlyNom = 'caseOnly:nominativ',
  FormTypeCaseOnlyAkk = 'caseOnly:akkusativ',
  FormTypeCaseOnlyDat = 'caseOnly:dativ',
  FormTypeCaseOnlyGen = 'caseOnly:genitiv',

  FormTypeAdjComparative = 'adjective:comparative',
  FormTypeAdjSuperlative = 'adjective:superlative',

  FormTypeReflexiveAkkIch = 'reflexive:akkusativ:ich',
  FormTypeReflexiveAkkDu = 'reflexive:akkusativ:du',
  FormTypeReflexiveAkkErSieEs = 'reflexive:akkusativ:er/sie/es',
  FormTypeReflexiveAkkIhr = 'reflexive:akkusativ:ihr',
  FormTypeReflexiveAkkWir = 'reflexive:akkusativ:wir',
  FormTypeReflexiveAkkSie = 'reflexive:akkusativ:sie/Sie',
  FormTypeReflexiveDatIch = 'reflexive:dativ:ich',
  FormTypeReflexiveDatDu = 'reflexive:dativ:du',
  FormTypeReflexiveDatErSieEs = 'reflexive:dativ:er/sie/es',
  FormTypeReflexiveDatIhr = 'reflexive:dativ:ihr',
  FormTypeReflexiveDatWir = 'reflexive:dativ:wir',
  FormTypeReflexiveDatSie = 'reflexive:dativ:sie/Sie',
}

export type WordForm = BaseModel & {
  type: WordFormType;
  form: string;
};

export type WordPOS = BaseModel & {
  posType: WordPOSTypeExtended;
  translations: WordTranslation[];
  usageExamples: WordUsageExample[];
  forms: WordForm[];
  verbProperties?: VerbProperties;
  nounProperties?: NounProperties;
};

export type WordPOSWithLemma = WordPOS & {
  lemma: string;
};

export type Word = BaseModel & {
  word: string;
  wordPOSs: WordPOS[];
};
