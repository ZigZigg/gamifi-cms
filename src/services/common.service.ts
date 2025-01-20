import { DepartmentsRequest, IndustryRequest } from '@/types/common';
import Instance from './instance';

const getDepartments = async (params: DepartmentsRequest): Promise<any> => {
  return await Instance.get(`/departments`, {
    params,
  });
};
const getListIndustry = async (): Promise<IndustryRequest> => {
  return await Instance.get(`/progress-list/industry`);
};

const CommonService = {
  getDepartments,
  getListIndustry,
};

export default CommonService;
