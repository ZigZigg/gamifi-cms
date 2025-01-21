import { combineReducers } from '@reduxjs/toolkit';
import { authReducer } from './slices/auth';
import { apiReducer } from './api';
import persistReducer from 'redux-persist/es/persistReducer';
import storage from 'redux-persist/es/storage';
import { commonReducer } from './slices/common/common.slices';

export const rootReducer = combineReducers({
  auth: persistReducer(
    {
      key: 'auth',
      storage,
      whitelist: ['token', 'isLoggedIn', 'user'],
    },
    authReducer
  ),
  common: persistReducer(
    {
      key: 'common',
      storage,
      whitelist: [],
    },
    commonReducer
  ),
  api: apiReducer,
});
