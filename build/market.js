Object.defineProperty(exports, "__esModule", { value: true });
exports.Market = void 0;
const helpers_find_1 = require("./helpers.find");
const helpers_terminal_1 = require("./helpers.terminal");
class Market {
    constructor(room, game = Game) {
        this.terminals = [];
        this.game = Game;
        this.roomName = room.name;
        this.game = game;
        this.terminals = helpers_find_1.HelpersFind.findMyActiveReadyToUseTerminals(room);
    }
    run() {
        this.terminals.forEach(terminal => this.terminalTrade(terminal));
    }
    terminalTrade(terminal) {
        const resourcesAndAmounts = helpers_terminal_1.HelpersTerminal.getTerminalMarketResourcesAndAmounts(terminal);
        const energy = terminal.store[RESOURCE_ENERGY];
        for (const resourceAndAmount of resourcesAndAmounts) {
            const [resourceType, availableAmount] = resourceAndAmount;
            const buyOrders = this.game.market.getAllOrders({
                type: ORDER_BUY,
                resourceType,
            });
            const sortedOrders = helpers_terminal_1.HelpersTerminal.sortOrders(buyOrders);
            const theBestOrder = helpers_terminal_1.HelpersTerminal.pickTheBestOrder(this.roomName, sortedOrders, availableAmount, energy);
            if (theBestOrder !== false) {
                helpers_terminal_1.HelpersTerminal.makeTrade(theBestOrder.id, availableAmount, theBestOrder.amount, this.roomName);
            }
        }
    }
}
exports.Market = Market;
