import type { AnalyzeDeResponse } from 'core/lib/apiClient';
import { cn } from 'core/lib/utils/cn';

import { TokenizedText } from './TokenizedText';
import { TranslatedText } from './TranslatedText';
import { useLastSelectedText } from './useLastSelectedText';
import { useRenderTokens } from './useRenderTokens';
import { useTokenInteraction } from './useTokenInteraction';
import { useUITokens } from './useUITokens';

const commonStyles = cn(`min-h-0 flex-1 rounded bg-white p-3 shadow-[inset_0_2px_8px_rgba(0,0,0,0.25)]`);

type TextTranslatorParams = {
  originalText: string;
  enabled: boolean;
};
type TextTranslatorReturn = {
  translatedText: string;
  translationError: string | undefined;
  isLoading: boolean;
};
type UseTextTranslator = (params: TextTranslatorParams) => TextTranslatorReturn;

type Props = {
  analyzeDEText: (text: string) => Promise<AnalyzeDeResponse>;
  useTranslatedText: UseTextTranslator;
  isTextTranslationEnabled: boolean;
  className?: string;
};

export const InteractiveTranslation = (props: Props) => {
  const { isTextTranslationEnabled, className, analyzeDEText, useTranslatedText } = props;

  const { uiTokens, groupsMap, loadUITokensError, loadUITokens } = useUITokens({
    analyzeDEText,
  });

  const { selectedText } = useLastSelectedText({
    onChangeText: loadUITokens,
  });

  const { hoveredToken, selectedRootToken, handleMouseEnterToken, handleMouseLeaveToken, handleClickToken } =
    useTokenInteraction({
      uiTokens,
      groupsMap,
    });

  const { renderTokens } = useRenderTokens({
    text: selectedText,
    uiTokens,
    groupsMap,
    hoveredToken,
    selectedRootToken,
  });

  const {
    translatedText,
    translationError,
    isLoading: isTranslationLoading,
  } = useTranslatedText({
    originalText: selectedText,
    enabled: isTextTranslationEnabled,
  });

  return (
    <div className={cn('relative flex h-0 grow flex-col gap-3 overflow-hidden select-none', className)}>
      <TokenizedText
        renderTokens={renderTokens}
        loadUITokensError={loadUITokensError}
        onClickToken={handleClickToken}
        onMouseEnterToken={handleMouseEnterToken}
        onMouseLeaveToken={handleMouseLeaveToken}
        className={commonStyles}
      />

      {isTextTranslationEnabled && (
        <TranslatedText
          translatedText={translatedText}
          translationError={translationError}
          loading={isTranslationLoading}
          className={commonStyles}
        />
      )}
    </div>
  );
};
