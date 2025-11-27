export enum TargetLanguage {
  ENGLISH = 'en',
  RUSSIAN = 'ru-RU',
  TURKISH = 'tr-TR',
  POLISH = 'pl-PL',
  ARABIC = 'ar-SA',
  FRENCH = 'fr-FR',
  SPANISH = 'es-ES',
}

export const humanReadableTargetLanguageMap: Record<TargetLanguage, string> = {
  [TargetLanguage.ENGLISH]: 'English',
  [TargetLanguage.RUSSIAN]: 'Russian',
  [TargetLanguage.TURKISH]: 'Turkish',
  [TargetLanguage.POLISH]: 'Polish',
  [TargetLanguage.ARABIC]: 'Arabic',
  [TargetLanguage.FRENCH]: 'French',
  [TargetLanguage.SPANISH]: 'Spanish',
};
