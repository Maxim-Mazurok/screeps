Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpersTerminal = void 0;
const AVERAGE_PRICES = {}; // TODO: use MarketResourceConstant instead of string
AVERAGE_PRICES[RESOURCE_HYDROGEN] = 0.2;
AVERAGE_PRICES[RESOURCE_ENERGY] = 0.02;
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
        const realPriceOrders = [];
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
                realPrice =
                    (amount * order.price -
                        transactionCost * AVERAGE_PRICES[RESOURCE_ENERGY]) /
                        amount;
            }
            if (transactionCost <= energy) {
                if (realPrice !== Infinity) {
                    order.price = realPrice;
                    realPriceOrders.push(order);
                }
                else {
                    return order;
                }
            }
        }
        if (realPriceOrders.length > 0) {
            return (realPriceOrders
                .filter(order => order.price > 0)
                .sort((order1, order2) => order2.price - order1.price)[0] || false);
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
