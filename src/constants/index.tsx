import { TablePaginationConfig } from 'antd';

export const REGEX = {
  ALLOW_LOWERCASE: /[a-z]/,
  ALLOW_UPPERCASE: /[A-Z]/,
  ALLOW_NUMBER: /[0-9]/,

  PHONENUMBER_TEST: /^[0-9]*$/,
  PHONENUMBER_SANITIZED: /[^0-9]/g,

  RATE_TEST: /^[0-9.]$/,
  RATE_SANITIZED: /[^0-9.]/g,
};

export const PaginationConfig: TablePaginationConfig = {
  current: 1,
  pageSize: 20,
  pageSizeOptions: ['10', '20', '50', '100'],
  showSizeChanger: true,
  showQuickJumper: false,
};

export const DATE_FORMAT = {
  DEFAULT: 'DD-MM-YYYY',
  YMD: 'YYYY-MM-DD',
  DATE_DMY_Hms: 'YYYY-MM-DD HH:mm:ss',
  YYYYMMDD: 'YYYYMMDD',
  YYYYMM: 'YYYY-MM',
  HHMMSS: 'HH:mm:ss',
  DATE_DMY_Hm: 'DD/MM/YYYY HH:mm',
};

export const PageSizeOptions = ['5', '10', '50', '100'];

export const urlIgnoreCheckInterceptor = [
  '/progress-list/export',
  '/bookkeepings/export',
  '/break-list/export',
  '/settlement-list/export',
  '/report/export',
  '/settlement-list/export-template-edit',
  '/reward-history/export'
];

export const locationPathName = {
  progressNewCompany: '/progress-mgt/new-company-mgt',
};

export const socketEventName = {
  updatePaymentStatus: 'UPDATE_PAYMENT_STATUS_EVENT',
  updateSyncStatus: 'UPDATE_SYNC_STATUS',
};

export const FROM_DATE_OF_RECEIPT = 60;

export const ProgressFileType = {
  RECEIPT: 'RECEIPT',
  REPORT: 'REPORT',
};
export const DEPARTMENT_NOT_ALLOW_EDIT_RECEIPT = ['SALES', 'GENERAL_TEAM'];

export const ERROR_CODE = {
  INVALID_FILE_XLSX_FORMAT: 'INVALID_FILE_XLSX_FORMAT',
  INVALID_FILE_XLSX: 'INVALID_FILE_XLSX',
};
