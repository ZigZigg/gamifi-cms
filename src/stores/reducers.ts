import { combineReducers } from '@reduxjs/toolkit';
import { authReducer } from './slices/auth';
import { apiReducer } from './api';
import persistReducer from 'redux-persist/es/persistReducer';
import storage from 'redux-persist/es/storage';

export const rootReducer = combineReducers({
  auth: persistReducer(
    {
      key: 'auth',
      storage,
      whitelist: ['token', 'isLoggedIn', 'user'],
    },
    authReducer
  ),
  api: apiReducer,
});
