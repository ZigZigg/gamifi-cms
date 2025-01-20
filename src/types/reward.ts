export interface ITurnType {
    id: number;
    name: string;
    value: string;
}

export interface IReward {
    id: number;
    value: string;
    quantity: number;
    hold_quantity: string;
    winning_rate: number;
    type: TurnType;
    created_at: string;
    updated_at: string;
    turnTypeId: number;
    campaignId: number;
    winning_type: string;
    initial_winning_rate: number;
    initial_quantity: number;
    status: RewardStatus;
    turntype: ITurnType;
}

export enum TurnType {
    FREE='FREE',
    PAID='PAID'
  }

export enum RewardStatus {
ACTIVE='ACTIVE',
HOLD='HOLD'
}

export interface IRewardListRequest {
    limit?: number;
    offset?: number;
    type: TurnType;
}

export interface IRewardListResponse {
    records: IReward[];
    total: number;
}