import { Find, Terminal } from './helpers/index';

export class Market {
  private terminals: StructureTerminal[] = [];
  private readonly roomName: RoomName;
  private readonly game: Game = Game;

  constructor(room: Room, game: Game = Game) {
    this.roomName = room.name;
    this.game = game;
    this.terminals = Find.findMyActiveReadyToUseTerminals(room);
  }

  run() {
    this.terminals.forEach(terminal => this.terminalTrade(terminal));
  }

  private terminalTrade(terminal: StructureTerminal) {
    const resourcesAndAmounts = Terminal.getTerminalMarketResourcesAndAmounts(
      terminal
    );
    const energy = terminal.store[RESOURCE_ENERGY];
    for (const resourceAndAmount of resourcesAndAmounts) {
      const [resourceType, availableAmount] = resourceAndAmount;
      const sellOrders = this.game.market.getAllOrders({
        type: ORDER_SELL,
        resourceType,
      });
      const sortedOrders = Terminal.sortOrders(sellOrders);
      const theBestOrder = Terminal.pickTheBestOrder(
        this.roomName,
        sortedOrders,
        availableAmount,
        energy
      );
      if (theBestOrder !== false) {
        Terminal.makeTrade(
          theBestOrder.id,
          availableAmount,
          theBestOrder.amount,
          this.roomName
        );
      }
    }
  }
}
