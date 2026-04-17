import { useRef, useState } from 'react';

import { handleApiError, useApiErrorHandler } from './useApiErrorHandler';
import { useEventCallback } from './useEventCallback';

export type ApiCallerOptions = {
  throwOnError?: boolean;
};

export const useApiCaller = <P = void, R = void>(fn: (p: P) => Promise<R>, options: ApiCallerOptions = {}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<R | undefined>(undefined);
  const loadRequestIndexRef = useRef(0);

  const { apiErrorMessage, handleApiError, resetApiErrorMessage } = useApiErrorHandler();

  const apiCall = useEventCallback(async (p: P) => {
    resetApiErrorMessage();
    setLoading(true);

    loadRequestIndexRef.current++;
    const requestIndex = loadRequestIndexRef.current;

    try {
      const response = await fn(p);

      if (requestIndex !== loadRequestIndexRef.current) {
        return response;
      }

      setData(response);
      setLoading(false);

      return response;
    } catch (error) {
      if (requestIndex !== loadRequestIndexRef.current) {
        return;
      }
      handleApiError(error);
      setLoading(false);

      if (options?.throwOnError) {
        throw error;
      }
    }
  });

  return {
    apiCall,
    loading,
    data,
    error: apiErrorMessage,
  };
};

type ApiCallerStoreWithData<R> = {
  data: R | undefined;
  loading: boolean;
  error: string | undefined;
};

type ApiCallerStoreWithoutData = {
  loading: boolean;
  error: string | undefined;
};

type ApiCallerStore<R> = ApiCallerStoreWithData<R> | ApiCallerStoreWithoutData;

export const createApiCaller = <P = void, R = void>(
  fn: (p: P) => Promise<R>,
  // valtio store
  store: ApiCallerStore<R>,
  options: ApiCallerOptions = {},
) => {
  let loadRequestIndex = 0;

  const apiCall = async (p: P) => {
    store.error = undefined;
    store.loading = true;

    loadRequestIndex++;
    const requestIndex = loadRequestIndex;

    try {
      const response = await fn(p);

      if (requestIndex !== loadRequestIndex) {
        return response;
      }

      if ('data' in store) {
        store.data = response;
      }
      store.loading = false;

      return response;
    } catch (error) {
      if (requestIndex !== loadRequestIndex) {
        return;
      }
      store.loading = false;
      const errorMessage = handleApiError(error);
      store.error = errorMessage;

      if (options?.throwOnError) {
        throw error;
      }
    }
  };

  return apiCall;
};
