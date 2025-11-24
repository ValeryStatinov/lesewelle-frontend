export type WithAbortSignal = {
  signal?: AbortSignal;
};

export type HttpClientRequestParams = WithAbortSignal & {
  searchParams?: URLSearchParams;
  body?: BodyInit;
  headers?: Headers;
};

export interface HttpClienter {
  get<T>(path: string, params?: HttpClientRequestParams): Promise<T>;
  post<T>(path: string, params?: HttpClientRequestParams): Promise<T>;
  postStream(path: string, params?: HttpClientRequestParams): Promise<ReadableStreamDefaultReader<ArrayBuffer>>;
}

export interface AuthManagerer {
  getAccessToken(): Promise<string>;
  getDeviceId(): Promise<string>;
}

export interface ApiClienter {
  get<T>(path: string, params?: HttpClientRequestParams): Promise<T>;
  post<T>(path: string, params?: HttpClientRequestParams): Promise<T>;
  postStream(path: string, params?: HttpClientRequestParams): Promise<ReadableStreamDefaultReader<ArrayBuffer>>;
  getDeviceId(): Promise<string>;
}

export type ClientType = 'extension' | 'frontend';

export interface PersistenceManager {
  getItem<T>(key: string): Promise<T | undefined>;
  setItem<T>(key: string, value: T): Promise<void>;
  removeItem(key: string): Promise<void>;
}
