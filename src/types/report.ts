export enum EExportReport {
  ALL = 'ALL',
  UNRECOVERED_LIST = 'UNRECOVERED_LIST',
  NON_RECEIPT_LIST = 'NON_RECEIPT_LIST',
  PROGRESS_LIST = 'PROGRESS_LIST',
}

export interface IParamsGenerateReport {
  type: string;
  fromDate: string;
  toDate: string;
}
