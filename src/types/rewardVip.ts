import { IReward, ITurnType } from "./reward";

export enum RewardVipStatus {
    PENDING='PENDING',
    REDEEMED='REDEEMED',
}

export interface IRewardVip {
    id: number;
    phone_number: string;
    status: RewardVipStatus
    turntype: ITurnType;
    reward: IReward
}

export interface IRewardVipRequest {
    rewardId: number;
    phoneNumber: string;
}

export interface IRewardVipUpdateRequest extends IRewardVipRequest {
    id: number
}

export interface IRewardVipDeleteRequest {
    id: number;
}

export interface IRewardVipListRequest {
    limit?: number;
    offset?: number;
}

export interface IRewardVipListResponse {
    records: IRewardVip[];
    total: number;
}