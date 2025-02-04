  import { IRewardHistoryListRequest, IRewardHistoryListResponse } from '@/types/rewardHistory';
import { apiSlice } from '.';
  
  const rewardListApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      getRewardHistoryList: builder.query<IRewardHistoryListResponse, IRewardHistoryListRequest>(
        {
          query: (params: IRewardHistoryListRequest) => ({
            params,
            url: '/reward-history',
            method: 'GET',
          }),
          providesTags: ['GAMI_Reward_History'],
        }
      ),
    }),
  });
  
  export const {
    useGetRewardHistoryListQuery,
  } = rewardListApi;
  