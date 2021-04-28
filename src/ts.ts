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
  build?: {
    maxHits: number;
    maxWallHits: number;
    minDiff: number;
  };
}

export interface EnergySourcesConfig {
  sources: EnergySource[];
  ignoreLinks?: RoomPosition[];
}

export type ReplenishableStructures =
  | STRUCTURE_TOWER
  | STRUCTURE_SPAWN
  | STRUCTURE_EXTENSION
  | STRUCTURE_LINK
  | STRUCTURE_STORAGE;
