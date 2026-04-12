import type { AnalyticsEvents } from 'core/lib/amplitude/events';
import { type AnalyzeDeResponse, ResponseErrorJSON, type WordsLookupReturn } from 'core/lib/apiClient';
import type { GetWordsSetsResponse, GetWordsSetWordsResponse } from 'core/lib/apiClient/endpoints/sets';
import type { Id } from 'core/lib/apiClient/endpoints/types/basemodel';
import type { Paginator } from 'core/lib/apiClient/endpoints/types/paginator';
import type { WordPOSType } from 'core/lib/apiClient/endpoints/types/words';
import type { TargetLanguage } from 'core/lib/types/languages';

export enum ExtensionMessageType {
  ANALYZE_TEXT_DE = 'ANALYZE_TEXT_DE',
  ACTIVATE_EXTENSION_WIDGET = 'ACTIVATE_EXTENSION_WIDGET',
  TRANSLATE_TEXT_STREAM = 'TRANSLATE_TEXT_STREAM',
  TRACK_ANALYTICS = 'TRACK_ANALYTICS',
  WORDS_LOOKUP = 'WORDS_LOOKUP',
  GET_WORDS_SETS = 'GET_WORDS_SETS',
  GET_WORDS_SET_WORDS = 'GET_WORDS_SET_WORDS',
  ADD_WORD_POS_TO_SET = 'ADD_WORD_POS_TO_SET',
  DELETE_WORD_POS_FROM_SET = 'DELETE_WORD_POS_FROM_SET',
}

export type ExtensionMessage = {
  type: ExtensionMessageType;
};

export type ApiErrorResponseMessage = {
  error: {
    name: string;
    message: string;
    code?: number;
  };
};

function throwOnApiError<T extends object | undefined>(
  response: T | ApiErrorResponseMessage,
  options: { allowEmptyResponse?: boolean } = {},
): asserts response is T {
  if (!response && !!options.allowEmptyResponse) {
    return;
  }

  if (!response) {
    throw new Error('response from background script is undefined');
  }

  if ('error' in response) {
    if (response.error.code) {
      throw new ResponseErrorJSON(response.error.message, response.error.code);
    }

    throw new Error(response.error.message);
  }
}

export type AnalyzeTextDeMessage = {
  type: ExtensionMessageType.ANALYZE_TEXT_DE;
  payload: {
    text: string;
  };
};

export const sendAnalyzeTextDeMessage = async (text: string) => {
  const message: AnalyzeTextDeMessage = {
    type: ExtensionMessageType.ANALYZE_TEXT_DE,
    payload: {
      text,
    },
  };

  const response = await chrome.runtime.sendMessage<AnalyzeTextDeMessage, AnalyzeDeResponse | ApiErrorResponseMessage>(
    message,
  );

  throwOnApiError(response);

  return response;
};

export const isAnalyzeTextDeMessage = (message: ExtensionMessage): message is AnalyzeTextDeMessage => {
  return message.type === ExtensionMessageType.ANALYZE_TEXT_DE;
};

export type ActivateExtensionWidgetMessage = {
  type: ExtensionMessageType.ACTIVATE_EXTENSION_WIDGET;
};

export const isActivateExtensionWidgetMessage = (
  message: ExtensionMessage,
): message is ActivateExtensionWidgetMessage => {
  return message.type === ExtensionMessageType.ACTIVATE_EXTENSION_WIDGET;
};

export type TranslateTextStreamMessage = {
  type: ExtensionMessageType.TRANSLATE_TEXT_STREAM;
  payload: {
    text: string;
    targetLanguage: TargetLanguage;
  };
};

export const isTranslateTextStreamMessage = (message: ExtensionMessage): message is TranslateTextStreamMessage => {
  return message.type === ExtensionMessageType.TRANSLATE_TEXT_STREAM;
};

export enum PortNameType {
  TRANSLATE_TEXT = 'TRANSLATE_TEXT',
}

export const isTranslateTextPortName = (name: PortNameType): name is PortNameType => {
  return name === PortNameType.TRANSLATE_TEXT;
};

export type StreamingDoneMessage = {
  done: true;
};

export const streamingDoneMessage = Object.freeze<StreamingDoneMessage>({ done: true });

export type TrackAnalyticsMessage = {
  type: ExtensionMessageType.TRACK_ANALYTICS;
  payload: {
    type: AnalyticsEvents;
    properties?: Record<string, unknown>;
  };
};

export const isTrackAnalyticsMessage = (message: ExtensionMessage): message is TrackAnalyticsMessage => {
  return message.type === ExtensionMessageType.TRACK_ANALYTICS;
};

export const sendTrackAnalyticsMessage = async (type: AnalyticsEvents, properties?: Record<string, unknown>) => {
  const message: TrackAnalyticsMessage = {
    type: ExtensionMessageType.TRACK_ANALYTICS,
    payload: {
      type,
      properties,
    },
  };

  await chrome.runtime.sendMessage<TrackAnalyticsMessage>(message);
};

export type WordsLookupMessage = {
  type: ExtensionMessageType.WORDS_LOOKUP;
  payload: {
    word: string;
    targetLanguage: TargetLanguage;
    pos?: WordPOSType;
  };
};

export const sendWordsLookupMessage = async (word: string, targetLanguage: TargetLanguage, pos?: WordPOSType) => {
  const message: WordsLookupMessage = {
    type: ExtensionMessageType.WORDS_LOOKUP,
    payload: {
      word,
      targetLanguage,
      pos,
    },
  };

  const response = await chrome.runtime.sendMessage<WordsLookupMessage, WordsLookupReturn | ApiErrorResponseMessage>(
    message,
  );

  throwOnApiError(response);

  return response;
};

export const isWordsLookupMessage = (message: ExtensionMessage): message is WordsLookupMessage => {
  return message.type === ExtensionMessageType.WORDS_LOOKUP;
};

export type GetWordsSetsMessage = {
  type: ExtensionMessageType.GET_WORDS_SETS;
  payload: {
    paginator: Paginator;
  };
};

export const sendGetWordsSetsMessage = async (paginator: Paginator) => {
  const message: GetWordsSetsMessage = {
    type: ExtensionMessageType.GET_WORDS_SETS,
    payload: { paginator },
  };

  const response = await chrome.runtime.sendMessage<
    GetWordsSetsMessage,
    GetWordsSetsResponse | ApiErrorResponseMessage
  >(message);

  throwOnApiError(response);

  return response;
};

export const isGetWordsSetsMessage = (message: ExtensionMessage): message is GetWordsSetsMessage => {
  return message.type === ExtensionMessageType.GET_WORDS_SETS;
};

export type GetWordsSetWordsMessage = {
  type: ExtensionMessageType.GET_WORDS_SET_WORDS;
  payload: {
    setId: Id;
    paginator: Paginator;
    lang: TargetLanguage;
  };
};

export const sendGetWordsSetWordsMessage = async (setId: Id, lang: TargetLanguage, paginator: Paginator) => {
  const message: GetWordsSetWordsMessage = {
    type: ExtensionMessageType.GET_WORDS_SET_WORDS,
    payload: { setId, paginator, lang },
  };

  const response = await chrome.runtime.sendMessage<
    GetWordsSetWordsMessage,
    GetWordsSetWordsResponse | ApiErrorResponseMessage
  >(message);

  throwOnApiError(response);

  return response;
};

export const isGetWordsSetWordsMessage = (message: ExtensionMessage): message is GetWordsSetWordsMessage => {
  return message.type === ExtensionMessageType.GET_WORDS_SET_WORDS;
};

export type AddWordPOSToSetMessage = {
  type: ExtensionMessageType.ADD_WORD_POS_TO_SET;
  payload: {
    setId: Id;
    wordPOSId: Id;
  };
};

export const sendAddWordPOSToSetMessage = async (setId: Id, wordPOSId: Id) => {
  const message: AddWordPOSToSetMessage = {
    type: ExtensionMessageType.ADD_WORD_POS_TO_SET,
    payload: { setId, wordPOSId },
  };

  const response = await chrome.runtime.sendMessage<AddWordPOSToSetMessage, undefined | ApiErrorResponseMessage>(
    message,
  );

  throwOnApiError(response, { allowEmptyResponse: true });
};

export const isAddWordPOSToSetMessage = (message: ExtensionMessage): message is AddWordPOSToSetMessage => {
  return message.type === ExtensionMessageType.ADD_WORD_POS_TO_SET;
};

export type DeleteWordPOSFromSetMessage = {
  type: ExtensionMessageType.DELETE_WORD_POS_FROM_SET;
  payload: {
    setId: Id;
    wordPOSId: Id;
  };
};

export const sendDeleteWordPOSFromSetMessage = async (setId: Id, wordPOSId: Id) => {
  const message: DeleteWordPOSFromSetMessage = {
    type: ExtensionMessageType.DELETE_WORD_POS_FROM_SET,
    payload: { setId, wordPOSId },
  };

  const response = await chrome.runtime.sendMessage<DeleteWordPOSFromSetMessage, undefined | ApiErrorResponseMessage>(
    message,
  );

  throwOnApiError(response, { allowEmptyResponse: true });
};

export const isDeleteWordPOSFromSetMessage = (message: ExtensionMessage): message is DeleteWordPOSFromSetMessage => {
  return message.type === ExtensionMessageType.DELETE_WORD_POS_FROM_SET;
};
