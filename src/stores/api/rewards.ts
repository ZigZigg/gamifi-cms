  import { apiSlice } from '.';
import { IRewardListRequest, IRewardListResponse } from '@/types/reward';
  
  const rewardListApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      getRewardList: builder.query<IRewardListResponse, IRewardListRequest>(
        {
          query: (params: IRewardListRequest) => ({
            params,
            url: '/rewards',
            method: 'GET',
          }),
          providesTags: ['GAMI_Reward_List'],
        }
      ),
    }),
  });
  
  export const {
    useGetRewardListQuery,
  } = rewardListApi;
  