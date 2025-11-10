import type { ClientType, HttpClienter, PersistenceManager } from './types';

const DEVICE_ID_STORAGE_KEY = 'deviceId';
const ACCESS_TOKEN_STORAGE_KEY = 'accessToken';
// TODO: not implemented on backend side yet
// const REFRESH_TOKEN_STORAGE_KEY = 'refreshToken';

const CLIENT_TYPE_HEADER = 'X-Client-Type';
const DEVICE_ID_HEADER = 'X-Device-Id';

const parseJwtPayload = <T>(token: string): T => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = atob(base64);

  return JSON.parse(jsonPayload) as T;
};

const isTokenExpired = (token: string): boolean => {
  const parsed = parseJwtPayload<{ exp: number }>(token);
  return Date.now() > parsed.exp * 1000;
};

const getDeviceIdFromToken = (token: string): string => {
  const parsed = parseJwtPayload<{ device_id: string }>(token);
  return parsed.device_id;
};

export class AuthManager {
  private httpClient: HttpClienter;
  private clientType: ClientType;
  private persistenceManager: PersistenceManager;
  private refreshTokenPromise: Promise<string> | null = null;

  public constructor(httpClient: HttpClienter, clientType: ClientType, persistenceManager: PersistenceManager) {
    this.httpClient = httpClient;
    this.clientType = clientType;
    this.persistenceManager = persistenceManager;
  }

  public async getAccessToken(): Promise<string> {
    const accessToken = await this.persistenceManager.getItem<string>(ACCESS_TOKEN_STORAGE_KEY);

    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise;
    }

    if (!accessToken || isTokenExpired(accessToken)) {
      this.refreshTokenPromise = this.refreshToken();
      return this.refreshTokenPromise;
    }

    return accessToken;
  }

  private async refreshToken(): Promise<string> {
    try {
      const headers = new Headers();
      headers.set(CLIENT_TYPE_HEADER, this.clientType);

      const deviceId = await this.persistenceManager.getItem<string>(DEVICE_ID_STORAGE_KEY);
      if (deviceId) {
        headers.set(DEVICE_ID_HEADER, deviceId);
      }

      const response = await this.httpClient.get<{ accessToken: string }>('/api/auth/refresh', { headers });
      await this.persistenceManager.setItem(ACCESS_TOKEN_STORAGE_KEY, response.accessToken);

      const newDeviceId = getDeviceIdFromToken(response.accessToken);
      if (newDeviceId !== deviceId) {
        console.warn('Device ID mismatch, device ID has been updated to a new value');
      }
      await this.persistenceManager.setItem(DEVICE_ID_STORAGE_KEY, newDeviceId);

      return response.accessToken;
    } finally {
      this.refreshTokenPromise = null;
    }
  }
}
