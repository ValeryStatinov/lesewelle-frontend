import type { AuthManagerer, HttpClienter, HttpClientRequestParams } from './types';

export class ApiClient {
  private httpClient: HttpClienter;
  private authManager: AuthManagerer;

  public constructor(httpClient: HttpClienter, authManager: AuthManagerer) {
    this.httpClient = httpClient;
    this.authManager = authManager;
  }

  private async setAuthHeader(headers: Headers): Promise<void> {
    const accessToken = await this.authManager.getAccessToken();
    if (headers.get('Authorization')) {
      console.warn('Authorization header already set, skipping');
    } else {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
  }

  public async getDeviceId(): Promise<string> {
    return this.authManager.getDeviceId();
  }

  public async get<T>(path: string, params?: HttpClientRequestParams): Promise<T> {
    const headers = params?.headers ?? new Headers();
    await this.setAuthHeader(headers);

    return this.httpClient.get<T>(path, { ...params, headers });
  }

  public async post<T>(path: string, params?: HttpClientRequestParams): Promise<T> {
    const headers = params?.headers ?? new Headers();
    await this.setAuthHeader(headers);

    return this.httpClient.post<T>(path, { ...params, headers });
  }

  public async postStream(path: string, params?: HttpClientRequestParams): Promise<ReadableStreamDefaultReader> {
    const headers = params?.headers ?? new Headers();
    await this.setAuthHeader(headers);

    return this.httpClient.postStream(path, { ...params, headers });
  }
}
