// Simple logger utility for debugging OAuth flow
export const oauthLogger = {
  log: (message, data = null) => {
    console.log(`[OAuth Debug] ${message}`, data);
  },
  error: (message, error = null) => {
    console.error(`[OAuth Error] ${message}`, error);
  },
  warn: (message, data = null) => {
    console.warn(`[OAuth Warning] ${message}`, data);
  },
};
