import { store } from '@/stores';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import axios from 'axios';
import type { AxiosRequestConfig, AxiosError } from 'axios';
import { authActions } from '@/stores/slices/auth';

export const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string | undefined } = { baseUrl: '' }
  ): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig['method'];
      data?: AxiosRequestConfig['data'];
      params?: AxiosRequestConfig['params'];
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params }) => {
    try {
      const state = store.getState();
      const accessToken = state.auth?.token as string;
      // const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const tz = 'Asia/Seoul';

      const result = await axios({
        url: (baseUrl || '/') + url,
        method,
        data,
        params,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'X-Timezone': tz,
        },
      });
      console.log("🚀 ~ result:", result)
      if (result.data.data) {
        return { data: result.data.data };
      } else {
        return Promise.reject(result.data);
      }
    } catch (axiosError: any) {
      const { response } = axiosError;
      const statusCode = response?.status;
      if (statusCode === 401) {
        store.dispatch(authActions.logout());
        window.location.href = '/logout';
      }
      if (statusCode === 403) {
        window.location.href = '/not-permission';
      }

      const error = axiosError as AxiosError;
      return {
        error: {
          status: error.response?.status,
          data: error.response?.data || error.message,
        },
      };
    }
  };
