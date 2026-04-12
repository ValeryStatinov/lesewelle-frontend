import type { BaseModel } from './basemodel';

export const DEFAULT_SET_NAME = 'default';

export enum Publicity {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export type WordsSet = BaseModel & {
  name: string;
  publicity: Publicity;
};
