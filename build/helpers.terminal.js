Object.defineProperty(exports, "__esModule", { value: true });
class HelpersTerminal {
    static getTerminalMarketResourcesAndAmounts(terminal) {
        const resources = new Map();
        Object.entries(terminal.store).forEach(([resource, amount]) => {
            if (amount > 0) {
                resources.set(resource, amount);
            }
        });
        return resources;
    }
    static sortOrders(orders) {
        return orders
            .filter(order => order.amount > 0)
            .sort((order1, order2) => order2.price - order1.price);
    }
    static pickTheBestOrder(roomName, orders, amount, energy) {
        for (let i = 0; i < orders.length; i++) {
            const order = orders[i];
            const transactionCost = order.roomName !== undefined // in case if order for tokens, there's no room
                ? Game.market.calcTransactionCost(amount, roomName, order.roomName)
                : 0;
            if (transactionCost <= energy) {
                return order;
            }
        }
        return false;
    }
    static makeTrade(orderId, availableAmount, orderAmount, roomName) {
        Game.market.deal(orderId, Math.min(availableAmount, orderAmount), roomName);
    }
}
exports.HelpersTerminal = HelpersTerminal;
//# sourceMappingURL=helpers.terminal.js.map