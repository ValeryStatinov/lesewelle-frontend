import { persistenceManager } from 'background/persistence/persistenceManager';

import { ApiClient, AuthManager, HttpClient, registerApiClient } from 'core/lib/apiClient';

export const initApiClient = () => {
  const httpClient = new HttpClient({
    baseURL: import.meta.env.VITE_BACKEND_API_URL,
  });

  const authManager = new AuthManager(httpClient, 'extension', persistenceManager);

  const apiClient = new ApiClient(httpClient, authManager);
  registerApiClient(apiClient);
};
