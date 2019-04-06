type ValueOf<T> = T[keyof T];

type RoomName = ValueOf<Pick<Room, 'name'>>;
type OrderId = ValueOf<Pick<Order, 'id'>>;
type OrderAmount = ValueOf<Pick<Order, 'amount'>>;

type TerminalMarketResourcesAndAmounts = Map<MarketResourceConstant, number>;

type RoomsConfig = RoomConfig[];

interface RoomConfig {
  //TODO: create config for rooms (number of creeps, policies, etc.)
}
