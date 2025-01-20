import type { Action, ThunkAction } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistStore,
} from 'redux-persist';
import { rootReducer } from './reducers';
import { apiSlice } from './api';
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux';
import { rtkQueryErrorLogger } from './rtkMiddlewareErrorLogger';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(rtkQueryErrorLogger)
      .concat(apiSlice.middleware);
  },
  devTools: true,
});

export type PAppState = ReturnType<typeof rootReducer>;
export type PAppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  PAppState,
  unknown,
  Action<string>
>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<PAppState> = useSelector;

const persistor = persistStore(store);

export { persistor, store };
