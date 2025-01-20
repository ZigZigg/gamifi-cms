import type { Middleware } from '@reduxjs/toolkit';

/**
 * Log a warning and show a toast!
 */
export const rtkQueryErrorLogger: Middleware = () => (next) => (action) => {
  if (action.type.endsWith('fulfilled')) {
    // Request succeeded
  } else if (action.type.endsWith('rejected')) {
    // Request failed
  }
  return next(action);
};
