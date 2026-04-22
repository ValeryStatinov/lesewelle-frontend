import { sendTrackAnalyticsMessage } from 'core/chromeMessages/messages';
import type { WordPOSWithLemma } from 'core/lib/apiClient/endpoints/types/words';
import type { TargetLanguage } from 'core/lib/types/languages';
import type { FlashcardSideType } from 'core/lib/ui/molecules/AbstractFlashcard/AbstractFlashcard';

import { AnalyticsEvents } from './events';

export const trackOpenSettings = () => {
  void sendTrackAnalyticsMessage(AnalyticsEvents.OPEN_SETTINGS);
};

export const trackChangeTargetLanguage = (targetLanguage: TargetLanguage) => {
  void sendTrackAnalyticsMessage(AnalyticsEvents.CHANGE_TARGET_LANGUAGE, { targetLanguage });
};

export const trackChangeFullTextTranslationEnabled = (isFullTextTranslationEnabled: boolean) => {
  void sendTrackAnalyticsMessage(AnalyticsEvents.CHANGE_FULL_TEXT_TRANSLATION_ENABLED, {
    isFullTextTranslationEnabled,
  });
};

export const trackOpenDictionary = () => {
  void sendTrackAnalyticsMessage(AnalyticsEvents.OPEN_DICTIONARY);
};

export const trackAddToDictionary = (pos: WordPOSWithLemma) => {
  void sendTrackAnalyticsMessage(AnalyticsEvents.ADD_TO_DICTIONARY, {
    lemma: pos.lemma,
    id: pos.id,
    posType: pos.posType,
  });
};

export const trackDeleteFromDictionary = (pos: WordPOSWithLemma) => {
  void sendTrackAnalyticsMessage(AnalyticsEvents.DELETE_FROM_DICTIONARY, {
    lemma: pos.lemma,
    id: pos.id,
    posType: pos.posType,
  });
};

export const trackStudyWords = () => {
  void sendTrackAnalyticsMessage(AnalyticsEvents.STUDY_WORDS);
};

export const trackStudyWordsFlipFlashcard = (pos: WordPOSWithLemma | undefined) => {
  void sendTrackAnalyticsMessage(AnalyticsEvents.STUDY_WORDS_FLIP_FLASHCARD, {
    lemma: pos?.lemma,
    id: pos?.id,
    posType: pos?.posType,
  });
};

type DifficultyTrackingParams = {
  pos: WordPOSWithLemma;
  side: FlashcardSideType;
  usageExamplesOpen: boolean;
  timeSpentMs: number;
};

export const trackStudyWordsEasy = (params: DifficultyTrackingParams) => {
  const { pos, side, usageExamplesOpen, timeSpentMs } = params;
  void sendTrackAnalyticsMessage(AnalyticsEvents.STUDY_WORDS_EASY, {
    lemma: pos.lemma,
    id: pos.id,
    posType: pos.posType,
    cardSide: side,
    usageExamplesOpen,
    timeSpentSec: Math.round(timeSpentMs / 100) / 10,
  });
};

export const trackStudyWordsMedium = (params: DifficultyTrackingParams) => {
  const { pos, side, usageExamplesOpen, timeSpentMs } = params;
  void sendTrackAnalyticsMessage(AnalyticsEvents.STUDY_WORDS_MEDIUM, {
    lemma: pos.lemma,
    id: pos.id,
    posType: pos.posType,
    cardSide: side,
    usageExamplesOpen,
    timeSpentSec: Math.round(timeSpentMs / 100) / 10,
  });
};

export const trackStudyWordsHard = (params: DifficultyTrackingParams) => {
  const { pos, side, usageExamplesOpen, timeSpentMs } = params;
  void sendTrackAnalyticsMessage(AnalyticsEvents.STUDY_WORDS_HARD, {
    lemma: pos.lemma,
    id: pos.id,
    posType: pos.posType,
    cardSide: side,
    usageExamplesOpen,
    timeSpentSec: Math.round(timeSpentMs / 100) / 10,
  });
};

type SessionEndParams = {
  cardsReviewed: number;
  totalSetSize: number;
};

export const trackStudyWordsSessionFinished = (params: SessionEndParams) => {
  void sendTrackAnalyticsMessage(AnalyticsEvents.STUDY_WORDS_SESSION_FINISHED, params);
};

export const trackStudyWordsSessionAborted = (params: SessionEndParams) => {
  void sendTrackAnalyticsMessage(AnalyticsEvents.STUDY_WORDS_SESSION_ABORTED, params);
};

export const trackStudyWordsToggleUsageExamples = (isOpen: boolean) => {
  void sendTrackAnalyticsMessage(AnalyticsEvents.STUDY_WORDS_TOGGLE_USAGE_EXAMPLES, {
    isOpen,
  });
};
