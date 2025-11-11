export enum ExtensionMessageType {
  ANALYZE_TEXT_DE = 'ANALYZE_TEXT_DE',
  GET_TEXT_TRANSLATION = 'GET_TEXT_TRANSLATION',
  GET_WORD_TRANSLATION = 'GET_WORD_TRANSLATION',
  ACTIVATE_EXTENSION_WIDGET = 'ACTIVATE_EXTENSION_WIDGET',
}

export type ExtensionMessage = {
  type: ExtensionMessageType;
};

export type AnalyzeTextDeMessage = {
  type: ExtensionMessageType.ANALYZE_TEXT_DE;
  payload: {
    text: string;
  };
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
