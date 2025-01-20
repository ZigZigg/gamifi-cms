import Axios, {
  AxiosRequestConfig,
  AxiosResponse,
  CancelTokenSource,
} from 'axios';
import { store } from '@/stores';
import { authActions } from '@/stores/slices/auth';
import { ERROR_CODE, urlIgnoreCheckInterceptor } from '@/constants';

const baseUrl = process.env.API_ENDPOINT;

let isTokenExpired = false;
let cancelTokenSource: CancelTokenSource;

const Instance = Axios.create({
  timeout: 20000,
  baseURL: baseUrl,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

Instance.interceptors.request.use(
  (config: AxiosRequestConfig | any) => {
    if (isTokenExpired) {
      cancelTokenSource.cancel('Token expired');
    } else {
      cancelTokenSource = Axios.CancelToken.source();
      config.cancelToken = cancelTokenSource.token;
    }

    const state = store.getState();
    const accessToken = state.auth?.token as string;
    // const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const tz = 'Asia/Seoul';
    if (accessToken) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
        'X-Timezone': tz,
      };
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

Instance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (
      response.config?.url &&
      urlIgnoreCheckInterceptor.includes(response.config?.url)
    ) {
      return response.data;
    }
    if (response.data?.code === 200) {
      return response.data.data || response.data;
    } else {
      return Promise.reject(response.data);
    }
  },
  async (error: any) => {
    const { response } = error;

    const statusCode = response?.status;
    if (statusCode === 401) {
      isTokenExpired = true;
      store.dispatch(authActions.logout());
      window.location.href = '/login';
    }
    if (statusCode === 403) {
      window.location.href = '/not-permission';
    }
    if (
      statusCode === 400 &&
      [
        ERROR_CODE.INVALID_FILE_XLSX,
        ERROR_CODE.INVALID_FILE_XLSX_FORMAT,
      ].includes(response?.data?.errorCode)
    ) {
      throw response.data;
    }

    const errorMessage = response?.data?.message || 'Error';
    if (errorMessage) {
      return Promise.reject(new Error(errorMessage));
    }
    return Promise.reject(error);
  }
);

export default Instance;
