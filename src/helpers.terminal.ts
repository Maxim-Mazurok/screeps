import {
  TerminalMarketResourcesAndAmounts,
  RoomName,
  OrderId,
  OrderAmount,
} from './ts';

const AVERAGE_PRICES: {[key in MarketResourceConstant]?: number} = {};
AVERAGE_PRICES[RESOURCE_ENERGY] = 0.079;

export class HelpersTerminal {
  static getTerminalMarketResourcesAndAmounts(
    terminal: StructureTerminal
  ): TerminalMarketResourcesAndAmounts {
    const resources: TerminalMarketResourcesAndAmounts = new Map();
    Object.entries(terminal.store).forEach(([resource, amount]) => {
      if (amount > 0 && resource !== RESOURCE_ENERGY) {
        resources.set(resource as MarketResourceConstant, amount as number);
      }
    });
    return resources;
  }

  static sortOrders(orders: Order[]): Order[] {
    return orders
      .filter(order => order.amount > 0)
      .filter(order => {
        if (AVERAGE_PRICES.hasOwnProperty(order.resourceType)) {
          // return order.price >= AVERAGE_PRICES[order.resourceType];
        }
        return true;
      })
      .sort((order1, order2) => order2.price - order1.price);
  }

  static pickTheBestOrder(
    roomName: RoomName,
    orders: Order[],
    availableAmount: number,
    energy: number
  ): Order | false {
    const realPriceOrders: Order[] = [];
    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      const amount = Math.min(availableAmount, order.amount);
      if (amount <= 0) return false;
      const transactionCost =
        order.roomName !== undefined // in case if order for tokens, there's no room
          ? Game.market.calcTransactionCost(amount, roomName, order.roomName)
          : 0;
      let realPrice = Infinity;
      const energyPrice = AVERAGE_PRICES[RESOURCE_ENERGY];
      if (energyPrice) {
        realPrice =
          (amount * order.price - transactionCost * energyPrice) / amount;
      }
      if (transactionCost <= energy) {
        if (realPrice !== Infinity) {
          order.price = realPrice;
          realPriceOrders.push(order);
        } else {
          return order;
        }
      }
    }
    if (realPriceOrders.length > 0) {
      return (
        realPriceOrders
          .filter(order => order.price > 0)
          .sort((order1, order2) => order2.price - order1.price)[0] || false
      );
    } else {
      return false;
    }
  }

  static makeTrade(
    orderId: OrderId,
    availableAmount: OrderAmount,
    orderAmount: OrderAmount,
    roomName: RoomName
  ) {
    Game.market.deal(orderId, Math.min(availableAmount, orderAmount), roomName);
  }
}
