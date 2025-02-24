  import { IRewardVipDeleteRequest, IRewardVipListRequest, IRewardVipListResponse, IRewardVipRequest, IRewardVipUpdateRequest } from '@/types/rewardVip';
import { apiSlice } from '.';
  
  const rewardVipListApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      getRewardListVip: builder.query<IRewardVipListResponse, IRewardVipListRequest>(
        {
          query: (params: IRewardVipListRequest) => ({
            params,
            url: '/rewards/listVip',
            method: 'GET',
          }),
          providesTags: ['GAMI_Reward_List_Vip'],
        }
      ),
      addNewRewardVip: builder.mutation<any, IRewardVipRequest>({
        query: (data: IRewardVipRequest) => ({
          data,
          url: '/rewards/addVip',
          method: 'POST',
        }),
        invalidatesTags: ['GAMI_Reward_List_Vip'],
      }),
      editRewardVip: builder.mutation<any, IRewardVipUpdateRequest>({
        query: (data: IRewardVipUpdateRequest) => {
          const { id, ...payload } = data;
          return {
            data: payload,
            url: `/rewards/vip/${id}`,
            method: 'PUT',
          };
        },
        invalidatesTags: [
          'GAMI_Reward_List_Vip'
        ],
      }),
      deleteRewardVip: builder.mutation<any, IRewardVipDeleteRequest>({
        query: (params: IRewardVipDeleteRequest) => {
          const { id } = params;
          return {
            url: `/rewards/vip/${id}`,
            method: 'DELETE',
          };
        },
        invalidatesTags: [
          'GAMI_Reward_List_Vip'
        ],
      }),
    }),
  });
  
  export const {
    useGetRewardListVipQuery,
    useAddNewRewardVipMutation,
    useEditRewardVipMutation,
    useDeleteRewardVipMutation
  } = rewardVipListApi;
  