let AVERAGE_PRICES: { [key: string]: number } = {}; // TODO: use MarketResourceConstant instead of string
AVERAGE_PRICES[RESOURCE_HYDROGEN] = 0.2;
AVERAGE_PRICES[RESOURCE_ENERGY] = 0.02;

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
          return order.price >= AVERAGE_PRICES[order.resourceType];
        } else {
          return true;
        }
      })
      .sort((order1, order2) => order2.price - order1.price);
  }

  static pickTheBestOrder(
    roomName: RoomName,
    orders: Order[],
    availableAmount: number,
    energy: number
  ): Order | false {
    let calcRealPrice: boolean = false;
    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      const amount = Math.min(availableAmount, order.amount);
      if (amount <= 0) return false;
      const transactionCost =
        order.roomName !== undefined // in case if order for tokens, there's no room
          ? Game.market.calcTransactionCost(amount, roomName, order.roomName)
          : 0;
      let realPrice = Infinity;
      if (AVERAGE_PRICES.hasOwnProperty(order.resourceType)) {
        realPrice = (amount * order.price - transactionCost * AVERAGE_PRICES[RESOURCE_ENERGY]) / amount;
        console.log(amount, ' * ', order.price, ' - ', transactionCost, ' * ', AVERAGE_PRICES[RESOURCE_ENERGY]);
        console.log('realPrice', realPrice);
      }
      if (transactionCost <= energy) {
        if (realPrice !== Infinity) {
          orders[i].price = realPrice;
          calcRealPrice = true;
        } else {
          return order;
        }
      }
    }
    if (calcRealPrice === true) {
      return orders
        .filter(order => order.price > 0)
        .sort((order1, order2) => order2.price - order1.price)[0] || false;
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
