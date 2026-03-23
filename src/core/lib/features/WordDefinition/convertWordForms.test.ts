import { describe, expect, test } from 'vitest';

import type { WordForm } from 'core/lib/apiClient/endpoints/types/words';
import { WordFormType } from 'core/lib/apiClient/endpoints/types/words';

import { convertToRenderFormGroups } from './convertWordForms';

describe('convertToRenderFormGroups', () => {
  test('converts verb partizip forms correctly', () => {
    const forms: WordForm[] = [
      {
        id: '1',
        type: WordFormType.FormTypeVerbPartizip1,
        form: 'machend',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      {
        id: '2',
        type: WordFormType.FormTypeVerbPartizip2,
        form: 'gemacht',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
    ];

    const result = convertToRenderFormGroups(forms);

    expect(result).toEqual([
      {
        group: 'Partizip I',
        forms: [{ label: '', formString: 'machend' }],
      },
      {
        group: 'Partizip II',
        forms: [{ label: '', formString: 'gemacht' }],
      },
    ]);
  });

  test('converts conjugatable präsens forms correctly and sorts by person', () => {
    const forms: WordForm[] = [
      {
        id: '1',
        type: WordFormType.FormTypeConjugatablePrasensSie,
        form: 'machen',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      {
        id: '2',
        type: WordFormType.FormTypeConjugatablePrasensIch,
        form: 'mache',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      {
        id: '3',
        type: WordFormType.FormTypeConjugatablePrasensDu,
        form: 'machst',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      {
        id: '4',
        type: WordFormType.FormTypeConjugatablePrasensErSieEs,
        form: 'macht',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
    ];

    const result = convertToRenderFormGroups(forms);

    expect(result).toEqual([
      {
        group: 'Präsens',
        forms: [
          { label: '(ich)', formString: 'mache' },
          { label: '(du)', formString: 'machst' },
          { label: '(er/sie/es)', formString: 'macht' },
          { label: '(sie/Sie)', formString: 'machen' },
        ],
      },
    ]);
  });

  test('converts präteritum forms correctly', () => {
    const forms: WordForm[] = [
      {
        id: '1',
        type: WordFormType.FormTypePrateritumPrasensDu,
        form: 'machtest',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      {
        id: '2',
        type: WordFormType.FormTypePrateritumPrasensIch,
        form: 'machte',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
    ];

    const result = convertToRenderFormGroups(forms);

    expect(result).toEqual([
      {
        group: 'Präteritum',
        forms: [
          { label: '(ich)', formString: 'machte' },
          { label: '(du)', formString: 'machtest' },
        ],
      },
    ]);
  });

  test('converts konjunktiv II forms correctly', () => {
    const forms: WordForm[] = [
      {
        id: '1',
        type: WordFormType.FormTypeKonjunktiv2PrasensIch,
        form: 'würde machen',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      {
        id: '2',
        type: WordFormType.FormTypeKonjunktiv2PrasensDu,
        form: 'würdest machen',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
    ];

    const result = convertToRenderFormGroups(forms);

    expect(result).toEqual([
      {
        group: 'Konjunktiv II',
        forms: [
          { label: '(ich)', formString: 'würde machen' },
          { label: '(du)', formString: 'würdest machen' },
        ],
      },
    ]);
  });

  test('converts declinable forms correctly and sorts by gender', () => {
    const forms: WordForm[] = [
      {
        id: '1',
        type: WordFormType.FormTypeDeclinatableNomPlural,
        form: 'die',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      {
        id: '2',
        type: WordFormType.FormTypeDeclinatableNomMasculine,
        form: 'der',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      {
        id: '3',
        type: WordFormType.FormTypeDeclinatableNomFeminine,
        form: 'die',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      {
        id: '4',
        type: WordFormType.FormTypeDeclinatableNomNeuter,
        form: 'das',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
    ];

    const result = convertToRenderFormGroups(forms);

    expect(result).toEqual([
      {
        group: 'Nominativ',
        forms: [
          { label: 'Masculine', formString: 'der' },
          { label: 'Feminine', formString: 'die' },
          { label: 'Neuter', formString: 'das' },
          { label: 'Plural', formString: 'die' },
        ],
      },
    ]);
  });

  test('converts noun forms correctly and sorts by number', () => {
    const forms: WordForm[] = [
      {
        id: '1',
        type: WordFormType.FormTypeNounNomPlural,
        form: 'Häuser',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      {
        id: '2',
        type: WordFormType.FormTypeNounNomSingular,
        form: 'Haus',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      {
        id: '3',
        type: WordFormType.FormTypeNounGenSingular,
        form: 'Hauses',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      {
        id: '4',
        type: WordFormType.FormTypeNounGenPlural,
        form: 'Häuser',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
    ];

    const result = convertToRenderFormGroups(forms);

    expect(result).toEqual([
      {
        group: 'Nominativ',
        forms: [
          { label: 'Singular', formString: 'Haus' },
          { label: 'Plural', formString: 'Häuser' },
        ],
      },
      {
        group: 'Genitiv',
        forms: [
          { label: 'Singular', formString: 'Hauses' },
          { label: 'Plural', formString: 'Häuser' },
        ],
      },
    ]);
  });

  test('converts case-only forms correctly', () => {
    const forms: WordForm[] = [
      {
        id: '1',
        type: WordFormType.FormTypeCaseOnlyNom,
        form: 'ich',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      {
        id: '2',
        type: WordFormType.FormTypeCaseOnlyAkk,
        form: 'mich',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      {
        id: '3',
        type: WordFormType.FormTypeCaseOnlyDat,
        form: 'mir',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
    ];

    const result = convertToRenderFormGroups(forms);

    expect(result).toEqual([
      {
        group: 'Nominativ',
        forms: [{ label: '', formString: 'ich' }],
      },
      {
        group: 'Akkusativ',
        forms: [{ label: '', formString: 'mich' }],
      },
      {
        group: 'Dativ',
        forms: [{ label: '', formString: 'mir' }],
      },
    ]);
  });

  test('converts adjective forms correctly', () => {
    const forms: WordForm[] = [
      {
        id: '1',
        type: WordFormType.FormTypeAdjComparative,
        form: 'schöner',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      {
        id: '2',
        type: WordFormType.FormTypeAdjSuperlative,
        form: 'am schönsten',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
    ];

    const result = convertToRenderFormGroups(forms);

    expect(result).toEqual([
      {
        group: 'Comparative',
        forms: [{ label: '', formString: 'schöner' }],
      },
      {
        group: 'Superlative',
        forms: [{ label: '', formString: 'am schönsten' }],
      },
    ]);
  });

  test('converts reflexive forms correctly with person labels', () => {
    const forms: WordForm[] = [
      {
        id: '1',
        type: WordFormType.FormTypeReflexiveAkkIch,
        form: 'mich',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      {
        id: '2',
        type: WordFormType.FormTypeReflexiveAkkDu,
        form: 'dich',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      {
        id: '3',
        type: WordFormType.FormTypeReflexiveDatIch,
        form: 'mir',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
    ];

    const result = convertToRenderFormGroups(forms);

    expect(result).toEqual([
      {
        group: 'Akkusativ',
        forms: [
          { label: '(ich)', formString: 'mich' },
          { label: '(du)', formString: 'dich' },
        ],
      },
      {
        group: 'Dativ',
        forms: [{ label: '(ich)', formString: 'mir' }],
      },
    ]);
  });

  test('sorts groups in correct order', () => {
    const forms: WordForm[] = [
      {
        id: '1',
        type: WordFormType.FormTypeNounGenSingular,
        form: 'Hauses',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      {
        id: '2',
        type: WordFormType.FormTypeVerbPartizip2,
        form: 'gemacht',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      {
        id: '3',
        type: WordFormType.FormTypeConjugatablePrasensIch,
        form: 'mache',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      {
        id: '4',
        type: WordFormType.FormTypeVerbPartizip1,
        form: 'machend',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      {
        id: '5',
        type: WordFormType.FormTypeNounNomSingular,
        form: 'Haus',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
    ];

    const result = convertToRenderFormGroups(forms);

    expect(result.map((g) => g.group)).toEqual(['Partizip I', 'Partizip II', 'Präsens', 'Nominativ', 'Genitiv']);
  });

  test('handles multiple forms in same group and sorts them', () => {
    const forms: WordForm[] = [
      {
        id: '1',
        type: WordFormType.FormTypeDeclinatableAkkPlural,
        form: 'die',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      {
        id: '2',
        type: WordFormType.FormTypeDeclinatableAkkMasculine,
        form: 'den',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      {
        id: '3',
        type: WordFormType.FormTypeDeclinatableAkkNeuter,
        form: 'das',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      {
        id: '4',
        type: WordFormType.FormTypeDeclinatableAkkFeminine,
        form: 'die',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
    ];

    const result = convertToRenderFormGroups(forms);

    expect(result).toEqual([
      {
        group: 'Akkusativ',
        forms: [
          { label: 'Masculine', formString: 'den' },
          { label: 'Feminine', formString: 'die' },
          { label: 'Neuter', formString: 'das' },
          { label: 'Plural', formString: 'die' },
        ],
      },
    ]);
  });

  test('handles all case types in correct sort order', () => {
    const forms: WordForm[] = [
      {
        id: '1',
        type: WordFormType.FormTypeNounGenSingular,
        form: 'gen',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      {
        id: '2',
        type: WordFormType.FormTypeNounDatSingular,
        form: 'dat',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      {
        id: '3',
        type: WordFormType.FormTypeNounAkkSingular,
        form: 'akk',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      {
        id: '4',
        type: WordFormType.FormTypeNounNomSingular,
        form: 'nom',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
    ];

    const result = convertToRenderFormGroups(forms);

    expect(result.map((g) => g.group)).toEqual(['Nominativ', 'Akkusativ', 'Dativ', 'Genitiv']);
  });

  test('handles empty array', () => {
    const forms: WordForm[] = [];

    const result = convertToRenderFormGroups(forms);

    expect(result).toEqual([]);
  });

  test('skips invalid form types', () => {
    const forms: WordForm[] = [
      {
        id: '1',
        type: WordFormType.FormTypeVerbPartizip1,
        form: 'machend',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      {
        id: '2',
        type: 'invalid:type' as WordFormType,
        form: 'invalid',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      {
        id: '3',
        type: WordFormType.FormTypeVerbPartizip2,
        form: 'gemacht',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
    ];

    const result = convertToRenderFormGroups(forms);

    expect(result).toEqual([
      {
        group: 'Partizip I',
        forms: [{ label: '', formString: 'machend' }],
      },
      {
        group: 'Partizip II',
        forms: [{ label: '', formString: 'gemacht' }],
      },
    ]);
  });

  test('handles complex mixed scenario with multiple groups and forms', () => {
    const forms: WordForm[] = [
      // Verbs
      {
        id: '1',
        type: WordFormType.FormTypeConjugatablePrasensIch,
        form: 'bin',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      {
        id: '2',
        type: WordFormType.FormTypeConjugatablePrasensDu,
        form: 'bist',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      {
        id: '3',
        type: WordFormType.FormTypePrateritumPrasensIch,
        form: 'war',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      // Partizips
      {
        id: '4',
        type: WordFormType.FormTypeVerbPartizip2,
        form: 'gewesen',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      // Nouns
      {
        id: '5',
        type: WordFormType.FormTypeNounNomSingular,
        form: 'Haus',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      {
        id: '6',
        type: WordFormType.FormTypeNounAkkSingular,
        form: 'Haus',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      // Adjectives
      {
        id: '7',
        type: WordFormType.FormTypeAdjComparative,
        form: 'besser',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
    ];

    const result = convertToRenderFormGroups(forms);

    expect(result).toEqual([
      {
        group: 'Partizip II',
        forms: [{ label: '', formString: 'gewesen' }],
      },
      {
        group: 'Präsens',
        forms: [
          { label: '(ich)', formString: 'bin' },
          { label: '(du)', formString: 'bist' },
        ],
      },
      {
        group: 'Präteritum',
        forms: [{ label: '(ich)', formString: 'war' }],
      },
      {
        group: 'Nominativ',
        forms: [{ label: 'Singular', formString: 'Haus' }],
      },
      {
        group: 'Akkusativ',
        forms: [{ label: 'Singular', formString: 'Haus' }],
      },
      {
        group: 'Comparative',
        forms: [{ label: '', formString: 'besser' }],
      },
    ]);
  });

  test('handles all conjugatable persons in correct order', () => {
    const forms: WordForm[] = [
      {
        id: '1',
        type: WordFormType.FormTypeConjugatablePrasensSie,
        form: 'sie/Sie form',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      {
        id: '2',
        type: WordFormType.FormTypeConjugatablePrasensWir,
        form: 'wir form',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      {
        id: '3',
        type: WordFormType.FormTypeConjugatablePrasensIhr,
        form: 'ihr form',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      {
        id: '4',
        type: WordFormType.FormTypeConjugatablePrasensErSieEs,
        form: 'er/sie/es form',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      {
        id: '5',
        type: WordFormType.FormTypeConjugatablePrasensDu,
        form: 'du form',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      {
        id: '6',
        type: WordFormType.FormTypeConjugatablePrasensIch,
        form: 'ich form',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
    ];

    const result = convertToRenderFormGroups(forms);

    expect(result[0].forms.map((f) => f.label)).toEqual([
      '(ich)',
      '(du)',
      '(er/sie/es)',
      '(ihr)',
      '(wir)',
      '(sie/Sie)',
    ]);
  });

  test('handles all declination cases in correct order', () => {
    const forms: WordForm[] = [
      {
        id: '1',
        type: WordFormType.FormTypeDeclinatableGenMasculine,
        form: 'des',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      {
        id: '2',
        type: WordFormType.FormTypeDeclinatableDatMasculine,
        form: 'dem',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      {
        id: '3',
        type: WordFormType.FormTypeDeclinatableAkkMasculine,
        form: 'den',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      {
        id: '4',
        type: WordFormType.FormTypeDeclinatableNomMasculine,
        form: 'der',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
    ];

    const result = convertToRenderFormGroups(forms);

    expect(result.map((g) => g.group)).toEqual(['Nominativ', 'Akkusativ', 'Dativ', 'Genitiv']);
  });
});
