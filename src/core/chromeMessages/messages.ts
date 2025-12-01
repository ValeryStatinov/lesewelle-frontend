import type { AnalyticsEvents } from 'core/lib/amplitude/events';
import { type AnalyzeDeResponse, ResponseErrorJSON, type TranslateWordResponse } from 'core/lib/apiClient';
import type { TargetLanguage } from 'core/lib/types/languages';

export enum ExtensionMessageType {
  ANALYZE_TEXT_DE = 'ANALYZE_TEXT_DE',
  GET_WORD_TRANSLATION = 'GET_WORD_TRANSLATION',
  ACTIVATE_EXTENSION_WIDGET = 'ACTIVATE_EXTENSION_WIDGET',
  TRANSLATE_TEXT_STREAM = 'TRANSLATE_TEXT_STREAM',
  TRACK_ANALYTICS = 'TRACK_ANALYTICS',
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

function throwOnApiError<T extends object>(response: T | ApiErrorResponseMessage): asserts response is T {
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

export type TranslateWordMessage = {
  type: ExtensionMessageType.GET_WORD_TRANSLATION;
  payload: {
    word: string;
    targetLanguage: TargetLanguage;
  };
};

export const sendTranslateWordMessage = async (word: string, targetLanguage: TargetLanguage) => {
  const message: TranslateWordMessage = {
    type: ExtensionMessageType.GET_WORD_TRANSLATION,
    payload: {
      word,
      targetLanguage,
    },
  };

  const response = await chrome.runtime.sendMessage<
    TranslateWordMessage,
    TranslateWordResponse | ApiErrorResponseMessage
  >(message);

  throwOnApiError(response);

  return response;
};

export const isTranslateWordMessage = (message: ExtensionMessage): message is TranslateWordMessage => {
  return message.type === ExtensionMessageType.GET_WORD_TRANSLATION;
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
