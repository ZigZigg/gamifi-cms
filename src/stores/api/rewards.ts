  import { apiSlice } from '.';
import { IRewardDeleteRequest, IRewardListRequest, IRewardListResponse, IRewardRequest, IRewardUpdateRequest } from '@/types/reward';
  
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
      addNewReward: builder.mutation<any, IRewardRequest>({
        query: (data: IRewardRequest) => ({
          data,
          url: '/rewards',
          method: 'POST',
        }),
        invalidatesTags: ['GAMI_Reward_List'],
      }),
      editReward: builder.mutation<any, IRewardUpdateRequest>({
        query: (data: IRewardUpdateRequest) => {
          const { id, ...payload } = data;
          return {
            data: payload,
            url: `/rewards/${id}`,
            method: 'PUT',
          };
        },
        invalidatesTags: [
          'GAMI_Reward_List'
        ],
      }),
      deleteReward: builder.mutation<any, IRewardDeleteRequest>({
        query: (params: IRewardDeleteRequest) => {
          const { id } = params;
          return {
            url: `/rewards/${id}`,
            method: 'DELETE',
          };
        },
        invalidatesTags: [
          'GAMI_Reward_List'
        ],
      }),
    }),
  });
  
  export const {
    useGetRewardListQuery,
    useAddNewRewardMutation,
    useEditRewardMutation,
    useDeleteRewardMutation
  } = rewardListApi;
  