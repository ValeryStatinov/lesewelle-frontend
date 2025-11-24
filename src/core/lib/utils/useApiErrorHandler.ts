import { useCallback, useState } from 'react';

import { ResponseErrorJSON } from '../apiClient';

import { SOMETHING_WENT_WRONG } from './consts';

export const useApiErrorHandler = () => {
  const [apiErrorMessage, setApiErrorMessage] = useState<string | undefined>(undefined);

  const handleApiError = useCallback((error: unknown) => {
    if (!(error instanceof Error)) {
      console.error('Unknown error:', error);
      setApiErrorMessage(SOMETHING_WENT_WRONG);

      return SOMETHING_WENT_WRONG;
    }

    if (error instanceof ResponseErrorJSON) {
      if (error.code >= 500) {
        console.error('Server error', error);
      }

      setApiErrorMessage(error.message);

      return error.message;
    }

    console.error(error.message);
    setApiErrorMessage(SOMETHING_WENT_WRONG);

    return SOMETHING_WENT_WRONG;
  }, []);

  const resetApiErrorMessage = useCallback(() => {
    setApiErrorMessage(undefined);
  }, []);

  return { apiErrorMessage, handleApiError, resetApiErrorMessage };
};
