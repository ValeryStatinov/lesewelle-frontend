import type { WordForm } from 'core/lib/apiClient/endpoints/types/words';
import { capitalizeFirstLetter } from 'core/lib/utils/strings';

const humanReadableConjugatable: Record<string, string> = {
  prasens: 'Präsens',
  prateritum: 'Präteritum',
  konjunktiv2: 'Konjunktiv II',
};

const humanReadableNumber: Record<string, string> = {
  singular: 'Singular',
  plural: 'Plural',
};

const humanReadableGenderOrNumber: Record<string, string> = {
  masculine: 'Masculine',
  feminine: 'Feminine',
  neuter: 'Neuter',
  plural: 'Plural',
};

const humanReadableCase: Record<string, string> = {
  nominativ: 'Nominativ',
  akkusativ: 'Akkusativ',
  dativ: 'Dativ',
  genitiv: 'Genitiv',
};

type ProcessedForm = {
  group: string;
  label: string;
  formString: string;
};

const processForm = (form: WordForm): ProcessedForm | null => {
  const { type, form: formString } = form;
  const formParts = type.split(':');

  const firstPart = formParts[0];
  if (firstPart === 'verb') {
    const partizip = formParts[1];
    const group = partizip === 'partizip1' ? 'Partizip I' : 'Partizip II';

    return {
      group,
      label: '',
      formString,
    };
  }

  if (firstPart === 'conjugatable') {
    const tense = formParts[1];
    const person = formParts[2];
    const group = humanReadableConjugatable[tense];

    if (!group) {
      console.warn('Unknown conjugation tense', tense);
    }

    return {
      group,
      label: `(${person})`,
      formString,
    };
  }

  if (firstPart === 'declinatable') {
    const caseType = formParts[1];
    const genderOrNumber = formParts[2];
    const group = humanReadableCase[caseType];

    if (!group) {
      console.warn('Unknown declination case type', caseType);
    }

    return {
      group: humanReadableCase[caseType],
      label: humanReadableGenderOrNumber[genderOrNumber],
      formString,
    };
  }

  if (firstPart === 'noun') {
    const caseType = formParts[1];
    const number = formParts[2];
    const group = humanReadableCase[caseType];

    if (!group) {
      console.warn('Unknown noun case type', caseType);
    }

    return {
      group: humanReadableCase[caseType],
      label: humanReadableNumber[number],
      formString,
    };
  }

  if (firstPart === 'caseOnly') {
    const caseType = formParts[1];
    const group = humanReadableCase[caseType];
    if (!group) {
      console.warn('Unknown case type', caseType);
    }

    return {
      group: humanReadableCase[caseType],
      label: '',
      formString,
    };
  }

  if (firstPart === 'adjective') {
    const compareType = formParts[1];

    return {
      group: capitalizeFirstLetter(compareType),
      label: '',
      formString,
    };
  }

  if (firstPart === 'reflexive') {
    const caseType = formParts[1];
    const person = formParts[2];
    const group = humanReadableCase[caseType];

    if (!group) {
      console.warn('Unknown reflexive case type', caseType);
    }

    return {
      group: humanReadableCase[caseType],
      label: `(${person})`,
      formString,
    };
  }

  console.warn(`[processForm] Unknown form type: ${type}`);
  return null;
};

type RenderFormGroup = {
  group: string;
  forms: Pick<ProcessedForm, 'label' | 'formString'>[];
};

const GROUPS_SORT_ORDER: Record<string, number> = {
  'Partizip I': 1,
  'Partizip II': 2,
  [`Präsens`]: 3,
  [`Präteritum`]: 4,
  'Konjunktiv II': 5,
  Nominativ: 6,
  Akkusativ: 7,
  Dativ: 8,
  Genitiv: 9,
  Comparative: 10,
  Superlative: 11,
};

const formGroupComparator = (a: RenderFormGroup, b: RenderFormGroup) => {
  const aGroupOrder = GROUPS_SORT_ORDER[a.group] || 100;
  const bGroupOrder = GROUPS_SORT_ORDER[b.group] || 100;

  if (aGroupOrder === bGroupOrder) {
    return 0;
  }

  return aGroupOrder - bGroupOrder;
};

const LABELS_SORT_ORDER: Record<string, number> = {
  '(ich)': 1,
  '(du)': 2,
  '(er/sie/es)': 3,
  '(ihr)': 4,
  '(wir)': 5,
  '(sie/Sie)': 6,
  Masculine: 7,
  Feminine: 8,
  Neuter: 9,
  Singular: 10,
  Plural: 11,
};

const labelComparator = (
  a: Pick<ProcessedForm, 'label' | 'formString'>,
  b: Pick<ProcessedForm, 'label' | 'formString'>,
) => {
  const aLabelOrder = LABELS_SORT_ORDER[a.label] || 100;
  const bLabelOrder = LABELS_SORT_ORDER[b.label] || 100;

  if (aLabelOrder === bLabelOrder) {
    return 0;
  }

  return aLabelOrder - bLabelOrder;
};

/**
 * Converts `WordForm[]`
 * from
 * @example
 *   [{ type: 'conjugatable:prasens:ich', form: 'mache' }, ...]
 *
 * to sorted array of `RenderFormGroup[]`
 * @example
 * [
 *   {
 *     group: 'Präsens',
 *     forms: [
 *       {
 *         label: '(ich)',
 *         formString: 'mache'
 *       },
 *     ]
 *   },
 * ]
 */
export const convertToRenderFormGroups = (forms: WordForm[]): RenderFormGroup[] => {
  const processedFormsMap: Record<string, RenderFormGroup> = {};

  for (const form of forms) {
    try {
      const processedForm = processForm(form);
      if (!processedForm) {
        continue;
      }

      if (!processedFormsMap[processedForm.group]) {
        processedFormsMap[processedForm.group] = {
          group: processedForm.group,
          forms: [],
        };
      }
      processedFormsMap[processedForm.group].forms.push({
        label: processedForm.label,
        formString: processedForm.formString,
      });
    } catch (error) {
      console.error(`[groupForms] Error processing form with id ${form.id}:`, error);
    }
  }

  const groups: RenderFormGroup[] = [];
  for (const group of Object.values(processedFormsMap)) {
    group.forms.sort(labelComparator);
    groups.push(group);
  }

  groups.sort(formGroupComparator);

  return groups;
};
