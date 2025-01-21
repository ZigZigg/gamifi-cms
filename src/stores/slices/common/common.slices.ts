import CommonService from '@/services/common.service';
import {
  CampaignItem,
  MasterDataItem,
} from '@/types/common';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PersistConfig, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
export interface CommonState {
  masterData: MasterDataItem[] | [];
  activeCampaign: CampaignItem | null;
}

const initialState: CommonState = {
  masterData: [],
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
        state.masterData = action.payload;
      })
      .addCase(getListMasterData.rejected, (state) => {
        state.masterData = [];
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
