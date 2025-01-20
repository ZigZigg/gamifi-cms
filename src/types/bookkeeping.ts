import {
  IContract,
  IProgressListRequest,
  IProgressListResponse,
  UpdateProgressListRequest,
} from './progress';

export interface IBookkeeping extends IContract {}

export interface IBookkeepingRequest extends IProgressListRequest {}
export interface IBookkeepingResponse extends IProgressListResponse {
  records: IBookkeeping[];
  total: number;
}

export interface UpdateBookkeepingListRequest
  extends UpdateProgressListRequest {
  bookkeepingManager?: number;
  bookkeepingContractor?: number;
  financeManager?: number;
}
