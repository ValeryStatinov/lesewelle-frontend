export type HttpClientRequestParams = {
  searchParams?: URLSearchParams;
  body?: BodyInit;
  headers?: Headers;
  signal?: AbortSignal;
};

export interface HttpClienter {
  get<T>(path: string, params?: HttpClientRequestParams): Promise<T>;
  post<T>(path: string, params?: HttpClientRequestParams): Promise<T>;
  postStream(path: string, params?: HttpClientRequestParams): Promise<ReadableStreamDefaultReader>;
}

export interface AuthManagerer {
  getAccessToken(): Promise<string>;
  getDeviceId(): Promise<string>;
}

export interface ApiClienter {
  get<T>(path: string, params?: HttpClientRequestParams): Promise<T>;
  post<T>(path: string, params?: HttpClientRequestParams): Promise<T>;
  postStream(path: string, params?: HttpClientRequestParams): Promise<ReadableStreamDefaultReader>;
  getDeviceId(): Promise<string>;
}

export type ClientType = 'extension' | 'frontend';

export interface PersistenceManager {
  getItem<T>(key: string): Promise<T | undefined>;
  setItem<T>(key: string, value: T): Promise<void>;
  removeItem(key: string): Promise<void>;
}
