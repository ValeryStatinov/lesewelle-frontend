import { afterEach, describe, expect, test, vi } from 'vitest';

import { HttpClient } from './httpClient';
import { ResponseErrorJSON } from './responseErrorJSON';

describe('HttpClient', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const httpClient = new HttpClient({
    baseURL: 'https://api.example.com',
  });

  test('success with json response', async () => {
    const jsonResponse = {
      a: 1,
    };
    const fetchResponse = {
      json: () => Promise.resolve(jsonResponse),
      ok: true,
    };

    globalThis.fetch = vi.fn().mockImplementation(() => Promise.resolve(fetchResponse));

    const response = await httpClient.get<typeof jsonResponse>('/test');

    expect(response).toEqual(jsonResponse);
  });

  test('error with json error response', async () => {
    const jsonResponse = {
      message: 'test',
      code: 400,
    };
    const fetchResponse = {
      json: () => Promise.resolve(jsonResponse),
      ok: false,
    };

    globalThis.fetch = vi.fn().mockImplementation(() => Promise.resolve(fetchResponse));
    try {
      await httpClient.get('/test');
    } catch (error) {
      expect(error).toBeInstanceOf(ResponseErrorJSON);
      expect((error as ResponseErrorJSON).message).toBe(jsonResponse.message);
      expect((error as ResponseErrorJSON).code).toBe(jsonResponse.code);
    }
  });

  test('streaming success', async () => {
    const chunks = ['Hello ', 'World', '!'];
    let chunkIndex = 0;

    const mockReader = {
      read: vi.fn().mockImplementation(() => {
        if (chunkIndex < chunks.length) {
          const value = new TextEncoder().encode(chunks[chunkIndex]);
          chunkIndex++;
          return Promise.resolve({ value, done: false });
        }
        return Promise.resolve({ value: undefined, done: true });
      }),
    };

    const fetchResponse = {
      ok: true,
      body: {
        getReader: () => mockReader,
      },
    };

    globalThis.fetch = vi.fn().mockImplementation(() => Promise.resolve(fetchResponse));

    const reader = await httpClient.postStream('/test', {
      body: JSON.stringify({ data: 'test' }),
    });

    const textDecoder = new TextDecoder();
    let result = '';

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) {
        break;
      }
      result += textDecoder.decode(chunk.value as Uint8Array, { stream: true });
    }

    expect(result).toBe('Hello World!');
    expect(mockReader.read).toHaveBeenCalledTimes(4); // 3 chunks + 1 done
  });

  test.skip('real streaming', async () => {
    const realHttpClient = new HttpClient({
      baseURL: 'http://localhost:8000',
    });

    const headers = new Headers();
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfdHlwZSI6ImZyb250ZW5kIiwiZGV2aWNlX2lkIjoidGVzdC1kZXZpY2UtaWQiLCJ2ZXJzaW9uIjoidjEiLCJpc3MiOiJ3b3JkYWl3ZXNvbWUtaGVpbWRhbGwiLCJzdWIiOiJ0ZXN0LXVzZXItaWQiLCJleHAiOjIwNTEyMjI0MDAsImlhdCI6MTc2MTIyNzE2OX0.vWAL4-SvMoKZACB3D45fn61c7Atp9YoFxZYVPRLYQLs';

    headers.set('Authorization', `Bearer ${token}`);
    headers.set('X-Client-Type', 'extension');

    const reader = await realHttpClient.postStream('/api/stream/nlp/translate/text', {
      body: JSON.stringify({
        text: 'Ich liebe dich',
        targetLanguage: 'en',
      }),
      headers,
    });

    const textDecoder = new TextDecoder();
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) {
        break;
      }

      const text = textDecoder.decode(chunk.value as ArrayBuffer, { stream: true });
      console.log(text);
    }
  });
});
