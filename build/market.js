Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./helpers/index");
class Market {
    constructor(room, game = Game) {
        this.terminals = [];
        this.game = Game;
        this.roomName = room.name;
        this.game = game;
        this.terminals = index_1.Find.findMyActiveReadyToUseTerminals(room);
    }
    run() {
        this.terminals.forEach(terminal => this.terminalTrade(terminal));
    }
    terminalTrade(terminal) {
        const resourcesAndAmounts = index_1.Terminal.getTerminalMarketResourcesAndAmounts(terminal);
        const energy = terminal.store[RESOURCE_ENERGY];
        for (const resourceAndAmount of resourcesAndAmounts) {
            const [resourceType, availableAmount] = resourceAndAmount;
            const sellOrders = this.game.market.getAllOrders({
                type: ORDER_SELL,
                resourceType,
            });
            const sortedOrders = index_1.Terminal.sortOrders(sellOrders);
            const theBestOrder = index_1.Terminal.pickTheBestOrder(this.roomName, sortedOrders, availableAmount, energy);
            if (theBestOrder !== false) {
                index_1.Terminal.makeTrade(theBestOrder.id, availableAmount, theBestOrder.amount, this.roomName);
            }
        }
    }
}
exports.Market = Market;
//# sourceMappingURL=market.js.map