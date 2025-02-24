import CommonService from '@/services/common.service';
import {
  CampaignItem,
  MasterDataItem,
} from '@/types/common';
import { IReward } from '@/types/reward';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PersistConfig, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
export interface CommonState {
  masterData: MasterDataItem[] | [];
  listReward: IReward[] | [];
  activeCampaign: CampaignItem | null;
}

const initialState: CommonState = {
  masterData: [],
  listReward: [],
  activeCampaign: null,
};

export const getListMasterData = createAsyncThunk(
  'common/getListMasterData',
  async (_, thunkAPI) => {
    try {
      const data = await CommonService.getListMasterData()
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getListAllReward = createAsyncThunk(
  'common/getListAllReward',
  async (_, thunkAPI) => {
    try {
      const data = await CommonService.getListAllReward();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getActiveCampaign = createAsyncThunk(
  'common/getActiveCampaign',
  async (_, thunkAPI) => {
    try {
      const data = await CommonService.getActiveCampaign()
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {},

  extraReducers: (builder) => {

    builder
      .addCase(getListMasterData.pending, (state) => {
        state.masterData = [];
      })
      .addCase(getListMasterData.fulfilled, (state, action) => {
        const data = action.payload?.filter((value:any) => !['GOOD_LUCK', 'AIRPOD_DEVICE', 'IPHONE_DEVICE'].includes(value.value));
        
        state.masterData = data;
      })
      .addCase(getListMasterData.rejected, (state) => {
        state.masterData = [];
      });
    builder
      .addCase(getListAllReward.pending, (state) => {
        state.listReward = [];
      })
      .addCase(getListAllReward.fulfilled, (state, action) => {
        const data = action.payload
        
        state.listReward = data;
      })
      .addCase(getListAllReward.rejected, (state) => {
        state.listReward = [];
      });
    builder
      .addCase(getActiveCampaign.pending, (state) => {
        state.activeCampaign = null;
      })
      .addCase(getActiveCampaign.fulfilled, (state, action) => {
        state.activeCampaign = action.payload;
      })
      .addCase(getActiveCampaign.rejected, (state) => {
        state.activeCampaign = null;
      });
  },
});

export const persistConfig: PersistConfig<CommonState> = {
  key: 'common',
  storage,
  whitelist: [],
};
export const commonReducer = persistReducer(persistConfig, commonSlice.reducer);
export const commonActions = commonSlice.actions;
