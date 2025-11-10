# API client to communicate with WordAIwesome backend

## Usage
1) create `HttpClient`
```javascript
const httpClient = new HttpClient({
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
});
```

2) create `AuthManager` and provide `persistenceManager` specific for your platform and storage, that satisfies simple interface
```javascript
export interface PersistenceManager {
  getItem<T>(key: string): Promise<T | undefined>;
  setItem<T>(key: string, value: T): Promise<void>;
  removeItem(key: string): Promise<void>;
}
```

```javascript
const authManager = new AuthManager(httpClient, 'extension', persistenceManager);
```

3) create `ApiClient`
```javascript
export const apiClient = new ApiClient(httpClient, authManager);
```

4) register newly created `apiClient` using `registerApiClient`
```javascript
registerApiClient(apiClient);
```

5) you are now ready to use any predefined function to fetch data, they follow naming convention `api*`
```javascript
const response = await apiAnalyzeDe(params);
```

### Complete example
```javascript
import { HttpClient, AuthManager, ApiClient, registerApiClient, apiAnalyzeDe } from 'core/lib/apiClient';
import { persistenceManager } from './myPersistenceManager';

const httpClient = new HttpClient({ baseURL: import.meta.env.VITE_BACKEND_API_URL });
const authManager = new AuthManager(httpClient, 'extension', persistenceManager);
const apiClient = new ApiClient(httpClient, authManager);
registerApiClient(apiClient);

// Use
const response = await apiAnalyzeDe(params);
```
