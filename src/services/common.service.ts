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

const getListMasterData = async (): Promise<any> => {
  return await Instance.get(`/rewards/getMasterData`);
}

const getActiveCampaign = async (): Promise<any> => {
  return await Instance.get(`/campaign/getActiveCampaign`);
}

const CommonService = {
  getDepartments,
  getListIndustry,
  getListMasterData,
  getActiveCampaign
};

export default CommonService;
