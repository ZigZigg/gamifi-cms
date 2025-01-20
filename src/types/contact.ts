import { IUser } from './auth';

export enum DepartmentCode {
  MASTER = 'MASTER',
  FINANCE_TEAM = 'FINANCE_TEAM',
  GENERAL_TEAM = 'GENERAL_TEAM',
  RETAX_TEAM = 'RETAX_TEAM',
  SALES = 'SALES',
}

export enum Authority {
  ADMINISTRATOR = 'ADMINISTRATOR',
  REPRESENTATIVE = 'REPRESENTATIVE',
}

export enum TableFunction {
  SYNC_DATA = 'SYNC_DATA',
  MODIFY_CLASSIFICATION = 'MODIFY_CLASSIFICATION',
  MODIFY_STATUS = 'MODIFY_STATUS',
  FULL_DOWNLOAD = 'FULL_DOWNLOAD',
  SINGLE_DOWNLOAD = 'SINGLE_DOWNLOAD',
  CHANGE_PAGINATION = 'CHANGE_PAGINATION',
  IMPORT = 'IMPORT',
  DOWNLOAD_TEMPLATE_EDIT = 'DOWNLOAD_TEMPLATE_EDIT',
}

export enum ContractStatus {
  PROGRESS = 'PROGRESS',
  BREAK = 'BREAK',
  COMPLETION = 'COMPLETION',
}

export enum SCREEN {
  PROGRESS = 'PROGRESS',
  BOOKKEEPING = 'BOOKKEEPING',
  FAILURES = 'FAILURES',
  WITHDRAWAL = 'WITHDRAWAL',
  COMPLETION = 'COMPLETION',
}

export interface ContactListRequest {
  limit?: number;
  offset?: number;
  keyword?: string;
  searchBy?: string[];
  filter?: any;
}

export interface FilterContactListRequest {
  id?: number | string;
  department_id?: string;
  authority?: string;
}

export interface ContactListResponse {
  users: IUser[];
  count: number;
}

export interface ContactItem {
  id: number;
  employeeName: string;
  department: string;
  authority: string;
  email: string;
  personalNumber: string;
  officeNumber: string;
}

export interface ICreateUser {
  name: string;
  email: string;
  phoneNumber: string;
  departmentId: number;
  authority: string;
  officeNumber?: string;
  bank?: string;
  accountHolder?: string;
  bankAccount?: string;
  regisNumber?: string;
  department?: string;
}

export interface ICreateUserResponse extends IUser {}
export interface IDelectContactRequest {
  id: string | number;
  isHard?: boolean;
}
export interface IEditUserRequest extends ICreateUser {
  id: string | number;
}
export interface IEditUserResponse {}

export interface IUserAutocompleteRequest {
  limit?: number;
  offset?: number;
  key?: string;
  value?: string | null;
}

export interface IUserAutocompleteResponse {
  records: any;
  total: number;
}
