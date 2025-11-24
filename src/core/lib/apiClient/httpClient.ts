import type { HttpClientRequestParams } from './interfaces';
import { ResponseErrorJSON } from './responseErrorJSON';

type HttpClientConfig = {
  baseURL: string;
};

type DoRequestParams = HttpClientRequestParams & { method: string };

/**
 * each call might throw ResponseErrorJSON
 */
export class HttpClient {
  private baseURL: string;

  public constructor(config: HttpClientConfig) {
    this.baseURL = config.baseURL;
  }

  private async doRequest<T>(path: string, params: DoRequestParams): Promise<T> {
    const url = new URL(path, this.baseURL);
    if (params.searchParams) {
      url.search = params.searchParams.toString();
    }

    const headers = params.headers ?? new Headers();
    if (!headers.get('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(url, {
      method: params.method,
      headers: headers,
      body: params.body,
      signal: params.signal,
    });

    if (!response.ok) {
      try {
        const jsonError = (await response.json()) as { message: string; code: number };

        throw new ResponseErrorJSON(jsonError.message, jsonError.code);
      } catch (error: unknown) {
        if (error instanceof ResponseErrorJSON) {
          throw error;
        }

        throw new Error(
          `Failed to fetch ${path}: ${response.statusText}, ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
      }
    }

    return response.json() as Promise<T>;
  }

  public async get<T>(path: string, params?: HttpClientRequestParams): Promise<T> {
    const doRequestParams: DoRequestParams = {
      ...params,
      method: 'GET',
    };

    return this.doRequest<T>(path, doRequestParams);
  }

  public async post<T>(path: string, params?: HttpClientRequestParams): Promise<T> {
    const doRequestParams: DoRequestParams = {
      ...params,
      method: 'POST',
    };

    return this.doRequest<T>(path, doRequestParams);
  }

  public async postStream(path: string, params?: HttpClientRequestParams): Promise<ReadableStreamDefaultReader> {
    const url = new URL(path, this.baseURL);
    if (params?.searchParams) {
      url.search = params.searchParams.toString();
    }

    const headers = params?.headers ?? new Headers();
    if (!headers.get('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: params?.body,
      signal: params?.signal,
    });

    if (!response.ok) {
      try {
        const jsonError = (await response.json()) as { message: string; code: number };

        throw new ResponseErrorJSON(jsonError.message, jsonError.code);
      } catch (error: unknown) {
        if (error instanceof ResponseErrorJSON) {
          throw error;
        }

        throw new Error(
          `Failed to fetch ${path}: ${response.statusText}, ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
      }
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error(`Failed to get reader for ${path}`);
    }

    return reader;
  }
}
