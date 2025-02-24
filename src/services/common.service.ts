import { CampaignUpdateRequest, DepartmentsRequest, IndustryRequest } from '@/types/common';
import Instance from './instance';
import { IRewardHistoryListRequest } from '@/types/rewardHistory';

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

const getListAllReward = async (): Promise<any> => {
  return await Instance.get(`/rewards/all`);
}

const getActiveCampaign = async (): Promise<any> => {
  return await Instance.get(`/campaign/getActiveCampaign`);
}

const updateCampaign = async (
  params: CampaignUpdateRequest
): Promise<any> => {
  return await Instance.put(`/campaign/${params.id}`, params);
};

const exportRewardHistory = async (
  params: IRewardHistoryListRequest
): Promise<any> => {
  return await Instance.post(`/reward-history/export`, params, {
    responseType: 'arraybuffer',
    headers: {
      Accept: 'application/octet-stream',
    },
  });
};

const CommonService = {
  getDepartments,
  getListIndustry,
  getListMasterData,
  getActiveCampaign,
  updateCampaign,
  exportRewardHistory,
  getListAllReward
};

export default CommonService;
