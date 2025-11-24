import type { ApiErrorResponseMessage } from 'core/chromeMessages/messages';
import { ResponseErrorJSON } from 'core/lib/apiClient';

type SendResponseFn = (response: unknown) => void;

export const apiErrorHandler = (error: unknown, sendResponse: SendResponseFn) => {
  if (error instanceof Error) {
    if (error instanceof ResponseErrorJSON) {
      const message: ApiErrorResponseMessage = {
        error: {
          name: error.name,
          message: error.message,
          code: error.code,
        },
      };
      sendResponse(message);

      return;
    }

    const message: ApiErrorResponseMessage = {
      error: {
        name: error.name,
        message: error.message,
      },
    };
    sendResponse(message);

    return;
  }

  const message: ApiErrorResponseMessage = {
    error: {
      name: 'UnknownError',
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      message: `Unknown error: ${error}`,
    },
  };

  sendResponse(message);
};
