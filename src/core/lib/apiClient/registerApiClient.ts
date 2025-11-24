import type { ApiClienter } from './interfaces';

const apiClientNotInitializedError = new Error('ApiClient not initialized. Did you forget to call registerApiClient?');

/**
 *
 * Do not import this variable directly, use the registerApiClient function to set it instead.
 * Then use predefined api* functions to make requests.
 */
export let _apiClient: ApiClienter = {
  get: () => {
    throw apiClientNotInitializedError;
  },
  post: () => {
    throw apiClientNotInitializedError;
  },
  postStream: () => {
    throw apiClientNotInitializedError;
  },
  getDeviceId: () => {
    throw apiClientNotInitializedError;
  },
};

export const registerApiClient = (apiClient: ApiClienter) => {
  _apiClient = apiClient;
};

export const getDeviceId = async () => {
  return _apiClient.getDeviceId();
};
