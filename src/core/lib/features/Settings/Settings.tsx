import { useSnapshot } from 'valtio';

import { appState } from 'core/lib/state/appState';
import { humanReadableTargetLanguageMap, TargetLanguage } from 'core/lib/types/languages';
import { Label } from 'core/lib/ui/atoms/Label/Label';
import { Switch } from 'core/lib/ui/atoms/Switch/Switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'core/lib/ui/organisms/Select/Select';

const FULL_TEXT_TRANSLATION_ID = 'full-text-translation';
const TARGET_TRANSLATION_LANGUAGE_ID = 'target-translation-language';

type Props = {
  onClose: () => void;
  onChangeFullTextTranslationEnabled: (isFullTextTranslationEnabled: boolean) => void;
  onChangeTargetLanguage: (targetLanguage: TargetLanguage) => void;
  className?: string;
};

export const Settings = (props: Props) => {
  const { className, onChangeFullTextTranslationEnabled, onChangeTargetLanguage } = props;

  const { isTextTranslationEnabled, targetTranslationLanguage } = useSnapshot(appState);

  const handleChangeTargetLanguage = (value: string) => {
    onChangeTargetLanguage(value as TargetLanguage);
  };

  return (
    <div className={className}>
      <h2 className='font-bold'>Settings</h2>

      <div className='mt-2 flex items-center gap-2'>
        <Label htmlFor={FULL_TEXT_TRANSLATION_ID}>Enable full text translation</Label>

        <Switch
          id={FULL_TEXT_TRANSLATION_ID}
          checked={isTextTranslationEnabled}
          onCheckedChange={onChangeFullTextTranslationEnabled}
        />
      </div>

      <div className='mt-1 flex items-center'>
        <Label htmlFor={TARGET_TRANSLATION_LANGUAGE_ID}>Target translation language</Label>

        <Select value={targetTranslationLanguage} onValueChange={handleChangeTargetLanguage}>
          <SelectTrigger id={TARGET_TRANSLATION_LANGUAGE_ID}>
            <SelectValue placeholder='Select a language' />
          </SelectTrigger>
          <SelectContent className='z-10' position='popper'>
            {Object.values(TargetLanguage).map((lang) => (
              <SelectItem key={lang} value={lang}>
                {humanReadableTargetLanguageMap[lang]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
