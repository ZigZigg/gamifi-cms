import { ITurnType } from "./reward";

export interface IRewardHistory{
    id: number;
    receive_date: string;
    user: {
        id: number;
        fullName: string;
        phoneNumber: string;
    }
    turntype: ITurnType;
}
export interface IRewardHistoryListRequest {
    limit?: number;
    offset?: number;
    phoneNumber?: number;
    fullName?: string;
    rewardType?: number;
    startDate?: string;
    endDate?: string;
}

export interface IRewardHistoryListResponse {
    records: IRewardHistory[];
    total: number;
}