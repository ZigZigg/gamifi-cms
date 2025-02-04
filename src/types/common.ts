export interface DepartmentsRequest {
  limit?: number;
  offset?: number;
  keyword?: string;
}

export interface DepartmentsResponse {}

export interface AccessMenu {
  rewards?: boolean;
}

export interface DepartmentItem {
  id: number;
  name: string;
  code: string;
  accessMenu: AccessMenu;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateDepartmentByIdRequest {
  id?: number;
  name: string;
  accessMenu: AccessMenu;
}

export interface IndustryItem {
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

export interface MasterDataItem {
  id: number;
  type: string;
  value: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface CampaignItem {
  id: number;
  name: string;
  status: string;
  startDate: string;
  endDate: string;
  startDateHold: string;
  endDateHold: string;
  created_at: string;
  updated_at: string;
}

export interface CampaignUpdateRequest {
  id: number;
  name: string;
  status: string;
  startDate: string;
  endDate: string;
  startDateHold: string;
  endDateHold: string;
}

export interface IndustryRequest {
  records: IndustryItem[];
  total: number;
}

export interface DepartmentsAutoCompleteRequest extends DepartmentsRequest {
  key?: string;
  value?: string;
}

export interface DepartmentsAutoCompleteResponse {
  records: any;
  total: number;
}

export enum SCREEN_NOTE {
  PROGRESS = 'PROGRESS',
  COMPLETION = 'COMPLETION',
}
