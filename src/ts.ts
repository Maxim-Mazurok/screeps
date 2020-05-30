import {CreepRole, EnergySource} from './enums';

type ValueOf<T> = T[keyof T];

export type RoomName = ValueOf<Pick<Room, 'name'>>;
export type OrderId = ValueOf<Pick<Order, 'id'>>;
export type OrderAmount = ValueOf<Pick<Order, 'amount'>>;

export type TerminalMarketResourcesAndAmounts = Map<
  MarketResourceConstant,
  number
>;

export type RoomsConfig = RoomConfig[];

export interface RoomConfig {
  //TODO: create config for rooms (number of creeps, policies, etc.)
  roomName: RoomName;
  claim?: Array<{
    to: RoomName;
  }>;
  skills?: {
    [index in CreepRole]?: BodyPartConstant[];
  };
  autoSpawn?: {
    enabled: boolean;
    maxCreeps: number;
  };
}

export interface EnergySourcesConfig {
  sources: EnergySource[];
}
