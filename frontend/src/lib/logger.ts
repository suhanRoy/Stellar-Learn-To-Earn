export const logger = {
  info: (message: string, meta?: any) => {
    console.info(`[INFO] ${new Date().toISOString()} - ${message}`, meta || '');
  },
  warn: (message: string, meta?: any) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, meta || '');
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error || '');
    // In a production environment, you would send this to Sentry, Datadog, etc.
    // e.g. Sentry.captureException(error);
  },
  debug: (message: string, meta?: any) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, meta || '');
    }
  }
};
