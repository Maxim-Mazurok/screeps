Object.defineProperty(exports, "__esModule", { value: true });
const AVERAGE_PRICES = {
    RESOURCE_HYDROGEN: 0.2,
    RESOURCE_ENERGY: 0.02,
};
class HelpersTerminal {
    static getTerminalMarketResourcesAndAmounts(terminal) {
        const resources = new Map();
        Object.entries(terminal.store).forEach(([resource, amount]) => {
            if (amount > 0 && resource !== RESOURCE_ENERGY) {
                resources.set(resource, amount);
            }
        });
        return resources;
    }
    static sortOrders(orders) {
        return orders
            .filter(order => order.amount > 0)
            .filter(order => {
            if (AVERAGE_PRICES.hasOwnProperty(order.resourceType)) {
                return order.price >= AVERAGE_PRICES[order.resourceType];
            }
            else {
                return true;
            }
        })
            .sort((order1, order2) => order2.price - order1.price);
    }
    static pickTheBestOrder(roomName, orders, availableAmount, energy) {
        let calcRealPrice = false;
        for (let i = 0; i < orders.length; i++) {
            const order = orders[i];
            const amount = Math.min(availableAmount, order.amount);
            if (amount <= 0)
                return false;
            const transactionCost = order.roomName !== undefined // in case if order for tokens, there's no room
                ? Game.market.calcTransactionCost(amount, roomName, order.roomName)
                : 0;
            let realPrice = Infinity;
            if (AVERAGE_PRICES.hasOwnProperty(order.resourceType)) {
                realPrice = (amount * order.price - transactionCost * AVERAGE_PRICES[order.resourceType]) / amount;
                console.log(amount, ' * ', order.price, ' - ', transactionCost, ' * ', AVERAGE_PRICES[order.resourceType]);
                console.log('realPrice', realPrice);
            }
            if (transactionCost <= energy) {
                if (realPrice !== Infinity) {
                    orders[i].price = realPrice;
                    calcRealPrice = true;
                }
                else {
                    return order;
                }
            }
        }
        if (calcRealPrice === true) {
            return orders.sort((order1, order2) => order2.price - order1.price)[0];
        }
        else {
            return false;
        }
    }
    static makeTrade(orderId, availableAmount, orderAmount, roomName) {
        Game.market.deal(orderId, Math.min(availableAmount, orderAmount), roomName);
    }
}
exports.HelpersTerminal = HelpersTerminal;
//# sourceMappingURL=helpers.terminal.js.map