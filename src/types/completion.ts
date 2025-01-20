import { Key } from 'react';
import { UpdateProgressListRequest } from './progress';

export enum PayoutType {
  CHOICE = 'CHOICE',
  BILL = 'BILL',
}
export enum BusinessType {
  INDIVIDUAL = 'INDIVIDUAL',
  CORPORATE = 'CORPORATE',
}

export interface ICompletion {
  id: number;
  external_contract_id: string;
  deposit_date?: string;
  company_name: string;
  deposit_desti?: string;
  business_type?: string;
  sale: number;
  refund_amount: number;
  fee: number;
  income_tax?: string;
  remark?: string;
  deposit_amount?: string;
  other_fee?: string;
  settle_rate: number;
  supply_price?: string;
  vat?: string;
  settle_amount?: string;
  payout_type?: string;
  bill?: string;
  bank?: string;
  bill_account_number?: string;
  account_holder?: string;
  regis_number: string;
  created_at: string;
  updated_at: string;
  sale_data: {
    id: number;
    name: string;
  };
}

export interface ICompletionRequest {
  limit: number;
  offset: number;
  depositDateFrom?: string;
  depositDateTo?: string;
  businessType?: BusinessType | string;
  companyName?: string;
  saleName?: string;
}
export interface ICompletionResponse {
  records: ICompletion[];
  total: number;
}

export interface IUpdateCompletionListRequest
  extends UpdateProgressListRequest {}

export interface IParamsExportCompletion {
  ids: Key[];
}
