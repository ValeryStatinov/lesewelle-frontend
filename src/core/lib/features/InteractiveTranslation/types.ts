export const NON_INTERACTIVE_TOKEN_ID = -1;

export const NON_INTERACTIVE_POSs = ['PUNCT', 'SYM', 'SPACE', 'X'];

export type RenderToken = {
  text: string;
  highlight: boolean;
  pressed: boolean;
  uiTokenId: number;
  id: number;
};
