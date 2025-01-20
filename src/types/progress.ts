import { ColumnType } from 'antd/es/table';
import { Key } from 'react';
import { DepartmentCode } from './contact';
import { IHistoryType } from '.';
// import IHistoryType from './index';

export enum ProgressType {
  NEW_BUSINESS = 'NEW_BUSINESS',
  BOOKKEEPING = 'BOOKKEEPING',
  CONTRACT_FAILURE = 'CONTRACT_FAILURE',
  APP_WITHDRAWAL = 'APP_WITHDRAWAL',
}

export enum CompanyClassification {
  COMPANY_NAME = 'company_name',
  CUSTOMER_REPRE = 'customer_repre',
  BUSINESS_NUM = 'business_num',
}

export enum StaffClassification {
  SALE = 'sale',
  MANAGE = 'manager',
  BOOKKEEPING_MANAGER = 'bookkeepingManager',
  BOOKKEEPING_CONTRACTOR = 'bookkeepingContractor',
  FINANCE_MANAGER = 'financeManager',
}

interface ITestDocument {
  id: boolean;
  cms: boolean;
  contract: boolean;
  sealCert: boolean;
  checkList: boolean;
  cpyBanbook: boolean;
  transRequest: boolean;
  confCompltDate?: string;
  psnalSignConfirm: boolean;
}

export interface IFollowUpObject {
  issuanceTax: boolean;
  regisDelivery: boolean;
}

export interface IContract {
  id: number;
  external_contract_id: string;
  appli_date: string;
  company_name: string;
  book_duty: BookkeepingDuty;
  type: string;
  customer_repre: string;
  business_num: string;
  industry: string;
  sale: string;
  manager: string;
  check_data: {
    homeTaxRes: boolean;
    employComData: boolean;
    verfCompltDate?: string;
    businessRegistration: boolean;
  };
  retax_amount: string;
  receipt_amount: string;
  test_document: ITestDocument;
  noti_date?: string;
  note?: string;
  date_receipt?: string;
  date_submission?: string;
  receipt?: string;
  refund_amount?: string;
  changes: string;
  com_rate?: string;
  fee?: string;
  tax_office?: string;
  remark?: string;
  payment_status?: IPaymentStatusObject;
  quotation?: string;
  reason_non_cmp: ReasonNonCompletionStatus;
  deposit_amount?: string;
  completion?: boolean;
  follow_up?: IFollowUpObject;
  submit_report?: string;
  created_at: string;
  updated_at: string;

  sale_data: ISale;
  manager_data: ISale;
  editableColumn?: string | null;
  departments?: any;
  book_mana_data?: IManager;
  book_con_data?: IManager;
  finance_mana_data?: ISale;
}

export interface ISale {
  id: number;
  name: string;
}
export interface IManager {
  id: number;
  metadata?: {
    code: string;
    name: string;
  };
}

export type TYPE_SCREEN =
  | 'NEW_BUSINESS'
  | 'BOOKKEEPING'
  | 'CONTRACT_FAILURE'
  | 'APP_WITHDRAWAL';

export enum NoteType {
  NOTE = 'NOTE',
  REMARK = 'REMARK',
}

export enum BookkeepingDuty {
  INDIVIDUAL = 'INDIVIDUAL',
  CORPORATION = 'CORPORATION',
}

export enum ProgressListType {
  NEW_BUSINESS = 'NEW_BUSINESS',
  BOOKKEEPING = 'BOOKKEEPING',
  CONTRACT_FAILURE = 'CONTRACT_FAILURE',
  APP_WITHDRAWAL = 'APP_WITHDRAWAL',
}

export enum ChangesType {
  YES = 'YES',
  NO = 'NO',
}

export enum PaymentStatus {
  SENT = 'SENT',
  SUCCESSFUL = 'SUCCESSFUL',
  CANCEL = 'CANCEL',
  REFUND = 'REFUND',
}

export enum ReasonNonCompletionStatus {
  DEFAULT = 'DEFAULT',
  ARREARS = 'ARREARS',
  TRANSFER_PROCESSING = 'TRANSFER_PROCESSING',
}

export interface IProgressListRequest {
  limit?: number;
  offset?: number;
}

export interface IProgressListResponse {
  records: IContract[];
  total: number;
}

export interface IPaymentStatusObject {
  orderId: string;
  status: PaymentStatus;
  datetime: string;
  lastDatetime: string;
  metadata: Record<string, any>;
}

export interface IRegistrant {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  phoneCode: string;
  phoneNumber: string;
  gender: string;
  role: string;
  status: string;
  emailVerified: boolean;
  deletedAt: string;
  createdAt: string;
  updatedAt: string;
  authority: string;
  officeNumber: number;
  isFirstLogin: boolean;
  bank: string;
  accountHolder: string;
  bankAccount: string;
  regisNumber: number;
  name: string;
}

export interface INote {
  id: number;
  progressListId: number;
  type: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  registrant: IRegistrant;
}

export interface INoteListRequest {
  limit?: number;
  offset?: number;
  type: NoteType;
}

export interface INoteListResponse {
  records: INote[];
  total: number;
}

export interface ICreateNoteRequest {
  content: string;
  type: NoteType;
  progressListId?: number;
  settlementListId?: number;
  externalContractId: string;
}

export enum StatusContractType {
  NEW_BUSINESS = 'NEW_BUSINESS',
  BOOKKEEPING = 'BOOKKEEPING',
  CONTRACT_FAILURE = 'CONTRACT_FAILURE',
  APP_WITHDRAWAL = 'APP_WITHDRAWAL',
  SELECT = 'SELECT',
}

export interface IParamsUpdateProgressStatus {
  ids: string[];
  type: string;
  noteContent: string;
}

export interface IParamsUpdatePeriod {
  period: number;
}

export interface IParamsExportProgress {
  ids: Key[];
}

export enum TYPE_SCREEN_FAIL {
  CONTRACT_FAILURE = 'CONTRACT_FAILURE',
  APP_WITHDRAWAL = 'APP_WITHDRAWAL',
}

export interface IParamsExportBreakList {
  type: TYPE_SCREEN_FAIL;
}

export interface CustomColumnType<RecordType> extends ColumnType<RecordType> {
  customClassName?: string;
}
export interface CustomColumnGroupType<RecordType>
  extends Omit<CustomColumnType<RecordType>, 'dataIndex'> {
  children: CustomColumnsType<RecordType>;
}

export type CustomColumnsType<RecordType> = Array<
  | (CustomColumnGroupType<RecordType> & {
      departments?: DepartmentCode[];
      customClassName?: string;
    })
  | (ColumnType<RecordType> & {
      departments?: DepartmentCode[];
      customClassName?: string;
    })
>;

export interface UpdateProgressListRequest {
  id: number;
  fields?: {
    companyName?: string;
    representative?: string;
    businessNumber?: string;
    industry?: string;
    sale?: string;
    manager?: string;
    notiDate?: string;
    changes?: ChangesType;
    commissionRate?: number;
    refundAmount?: number;
    taxOffice?: string;
    quotation?: string;
    reasonNonCompletion?: ReasonNonCompletionStatus;
    depositAmount?: number;
    completion?: boolean;
    submitReport?: boolean;
    receipt?: string;
    report?: string;
  };
  testiDocument?: {
    contract?: boolean;
    checkList?: boolean;
    cpyBanbook?: boolean;
    transRequest?: boolean;
    sealCert?: boolean;
    psnalSignConfirm?: boolean;
    cms?: boolean;
    id?: boolean;
  };
  checkData?: {
    businessRegistration?: boolean;
    homeTaxRes?: boolean;
    employComData?: boolean;
  };
  dateReceipt?: string;
  followUp?: {
    issuanceTax?: boolean;
    regisDelivery?: boolean;
  };
}
export interface IParamsCreatePayment {
  contractId: number;
  amount: number;
  phone: number | string;
}
export enum TYPE_DATA {
  MANAGER = 'MANAGER',
  AUTHORITY = 'AUTHORITY',
  INDUSTRY = 'INDUSTRY',
  BOOKKEEPING_MANAGER = 'BOOKKEEPING_MANAGER',
  BOOKKEEPING_CONTRACTOR = 'BOOKKEEPING_CONTRACTOR',
  FINANCE_MANAGER = 'FINANCE_MANAGER',
}

export interface ICommonDataRequest {
  limit?: number;
  offset?: number;
  type: TYPE_DATA;
  code?: 'EN' | 'KOR';
  key?: string;
  value?: string | null;
}

export interface IItemData {
  id: number;
  type: string;
  code: string;
  metadata: {
    code: string;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ICommonDataResponse {
  records: any;
  total: number;
}

export interface IParamsUploadFile {
  name: string;
  bucketName: string;
}
export interface IUploadFileResponse {
  presignUrl: string;
  accessPoint: string;
}
export interface IDeleteFileParams {
  id: number;
  type: string;
}
export interface IHistoryListRequest {
  limit?: number;
  offset?: number;
  type: string;
  key: IHistoryType;
  value: string;
}
export interface IHistoryItemDetail {
  name: string;
  field: string;
  recordId: number;
  changeDate: string;
  currentValue: any;
  email: string;
  isFileUpload?: string;
  isFileDeleted?: string;
  currentAmount?: number;
}
export interface IHistory {
  id: number;
  userId: number;
  type: string;
  detail: IHistoryItemDetail;
  createdAt: string;
  updatedAt: string;
}

export interface IHistoryListResponse {
  records: IHistory[];
  total: number;
}

export interface IGetPeriodResponse {
  period: number;
}

export interface IParamsSyncData {
  socketId: string;
}

export interface IAddNewContractRequest {
  companyName?: string;
  applicationDate?: string;
  bookkeepingDuty?: string;
  representative?: string;
  businessNumber?: number;
  industry?: string;
  businessRegistration?: true;
  homeTaxRes?: true;
  employComData?: true;
  retaxAmount?: number;
  carryOverAmount?: number;
}

export interface IDeleteContractRequest {
  id: string;
}

export interface IAddNewContractResponse {}

export enum RefundType {
  FULL_REQUEST = 'FULL_REQUEST',
  PARTIAL_REQUEST = 'PARTIAL_REQUEST',
}

export interface IRequestRefundRequest {
  contractId: number;
  partialAmount: number;
  type: RefundType;
}
