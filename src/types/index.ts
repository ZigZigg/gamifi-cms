import { TablePaginationConfig } from 'antd';

export interface ExampleDataRequest {
  id: '';
}

export interface ExampleDatResponse {
  data: Record<string, never>;
}

export interface TablePagination extends TablePaginationConfig {
  pageSize: number;
  current: number;
  total: number;
  pageSizeOptions?: number[] | string[];
}

export enum IHistoryType {
  CONTACT = 'CONTACT',
  COMPANY = 'COMPANY',
  DEPARTMENT = 'DEPARTMENT',
  BOOKKEEPING = 'BOOKKEEPING',
  CONTRACT_FAILURE = 'CONTRACT_FAILURE',
  WITHDRAW = 'WITHDRAW',
  SETTLE = 'SETTLE',
  REPORT = 'REPORT',
}
