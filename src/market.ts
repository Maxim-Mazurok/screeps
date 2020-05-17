import {HelpersFind, HelpersTerminal} from './helpers';

export class Market {
  private terminals: StructureTerminal[] = [];
  private readonly roomName: RoomName;
  private readonly game: Game = Game;

  constructor(room: Room, game: Game = Game) {
    this.roomName = room.name;
    this.game = game;
    this.terminals = HelpersFind.findMyActiveReadyToUseTerminals(room);
  }

  run() {
    this.terminals.forEach(terminal => this.terminalTrade(terminal));
  }

  private terminalTrade(terminal: StructureTerminal) {
    const resourcesAndAmounts = HelpersTerminal.getTerminalMarketResourcesAndAmounts(
      terminal
    );
    const energy = terminal.store[RESOURCE_ENERGY];
    for (const resourceAndAmount of resourcesAndAmounts) {
      const [resourceType, availableAmount] = resourceAndAmount;
      const buyOrders = this.game.market.getAllOrders({
        type: ORDER_BUY,
        resourceType,
      });
      const sortedOrders = HelpersTerminal.sortOrders(buyOrders);
      const theBestOrder = HelpersTerminal.pickTheBestOrder(
        this.roomName,
        sortedOrders,
        availableAmount,
        energy
      );
      if (theBestOrder !== false) {
        HelpersTerminal.makeTrade(
          theBestOrder.id,
          availableAmount,
          theBestOrder.amount,
          this.roomName
        );
      }
    }
  }
}
