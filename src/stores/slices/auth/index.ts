import AuthService from '@/services/auth.service';
import {
  IUser,
  LoginRequest,
} from '@/types/auth';
import { AccessMenu } from '@/types/common';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { PersistConfig, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

export interface AuthState {
  token: string;
  isLoggedIn: boolean;
  user: IUser | null;
  accessMenu: AccessMenu;
}

const initialState: AuthState = {
  token: '',
  isLoggedIn: false,
  user: null,
  accessMenu: {},
};

export const login = createAsyncThunk(
  'auth/login',
  async (params: LoginRequest, thunkAPI) => {
    try {
      const data = await AuthService.login(params);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth() {},
    setIsLogin: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },

    logout: (state) => {
      state.isLoggedIn = false;
      state.token = '';
      state.user = null;
    },
  },

  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoggedIn = false;
        state.user = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        const { token, user } = action.payload;
        state.token = token;
        state.user = user;
        state.isLoggedIn = true;
      })
      .addCase(login.rejected, (state) => {
        state.isLoggedIn = false;
        state.user = null;
      });
  },
});

export const persistConfig: PersistConfig<AuthState> = {
  key: 'auth',
  storage,
  whitelist: [],
};
export const authReducer = persistReducer(persistConfig, authSlice.reducer);
export const authActions = authSlice.actions;
