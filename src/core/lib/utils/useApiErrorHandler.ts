import { useCallback, useState } from 'react';

import { ResponseErrorJSON } from '../apiClient';

import { SOMETHING_WENT_WRONG } from './consts';

export const handleApiError = (error: unknown) => {
  if (!(error instanceof Error)) {
    console.error('Unknown error:', error);

    return SOMETHING_WENT_WRONG;
  }

  if (error instanceof ResponseErrorJSON) {
    if (error.code >= 500) {
      console.error('Server error', error);
    }

    return error.message;
  }

  console.error(error.message);

  return SOMETHING_WENT_WRONG;
};

export const useApiErrorHandler = () => {
  const [apiErrorMessage, setApiErrorMessage] = useState<string | undefined>(undefined);

  const onError = useCallback((error: unknown) => {
    const errorMessage = handleApiError(error);
    setApiErrorMessage(errorMessage);
  }, []);

  const resetApiErrorMessage = useCallback(() => {
    setApiErrorMessage(undefined);
  }, []);

  return { apiErrorMessage, handleApiError: onError, resetApiErrorMessage };
};
