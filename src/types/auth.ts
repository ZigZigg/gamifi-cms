import { AccessMenu } from './common';
import { DepartmentCode } from './contact';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: IUser;
}

export interface IUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phoneCode: string;
  phoneNumber: string;
  gender: string;
  role: string;
  status: string;
  emailVerified: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
  authority: string;
  department?: {
    accessMenu: AccessMenu;
    code: string;
    createdAt: string;
    id: number;
    name: string;
    updatedAt: string;
  };
  departmentId?: number;
  officeNumber?: string;
  isFirstLogin: boolean;
  bank?: string;
  accountHolder?: string;
  bankAccount?: string;
  regisNumber?: string;
  name: string;
  deparmentCode?: DepartmentCode;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {}

export interface ChangeTempoPasswordRequest {
  oldPassword?: string;
  password: string;
}

export interface ChangeTempoPasswordResponse extends IUser {}

export interface UpdateProfileRequest {
  id?: number;
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
  isFirstLogin?: boolean;
}

export interface UpdateProfileResponse extends IUser {}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ResetPasswordResponse {}
