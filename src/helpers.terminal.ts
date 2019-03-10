export class HelpersTerminal {
  static getTerminalMarketResourcesAndAmounts(
    terminal: StructureTerminal
  ): TerminalMarketResourcesAndAmounts {
    const resources: TerminalMarketResourcesAndAmounts = new Map();
    Object.entries(terminal.store).forEach(([resource, amount]) => {
      if (amount > 0) {
        resources.set(resource as MarketResourceConstant, amount as number);
      }
    });
    return resources;
  }

  static sortOrders(orders: Order[]): Order[] {
    return orders
      .filter(order => order.amount > 0)
      .sort((order1, order2) => order2.price - order1.price);
  }

  static pickTheBestOrder(
    roomName: RoomName,
    orders: Order[],
    amount: number,
    energy: number
  ): Order | false {
    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      const transactionCost =
        order.roomName !== undefined // in case if order for tokens, there's no room
          ? Game.market.calcTransactionCost(amount, roomName, order.roomName)
          : 0;
      if (transactionCost <= energy) {
        return order;
      }
    }
    return false;
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
