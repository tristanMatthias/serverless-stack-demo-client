import * as Sentry from '@sentry/browser';
import { Extras } from '@sentry/types';

const isLocal = process.env.NODE_ENV === 'development';

export function initSentry() {
  if (isLocal) {
    return;
  }

  Sentry.init({ dsn: 'https://5f83aa2e21064e47bab8a1f308f940eb@sentry.io/5185720' });
}

export const logError = (error: Error, errorInfo?: Extras) => {
  if (isLocal) return;

  Sentry.withScope(scope => {
    if (errorInfo) scope.setExtras(errorInfo);
    Sentry.captureException(error);
  });
};

export const onError = (error?: Error | any) => {
  if (!error) return;
  let err = error;
  let errorInfo: { url?: string } = {};
  let message = error.toString();

  // Auth errors
  if (!(error instanceof Error) && error.message) {
    errorInfo = error;
    message = error.message;
    err = new Error(message);
    // API errors
  } else if (error.config && error.config.url) {
    errorInfo.url = error.config.url;
  }

  logError(err, errorInfo);
};
