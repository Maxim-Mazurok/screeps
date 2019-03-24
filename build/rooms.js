Object.defineProperty(exports, "__esModule", { value: true });
const towers_1 = require("./towers");
const market_1 = require("./market");
class Rooms {
    constructor(game = Game) {
        this._rooms = [];
        for (const roomCoordinates of Object.keys(game.rooms)) {
            const room = game.rooms[roomCoordinates];
            this._rooms.push(room);
        }
    }
    get rooms() {
        return this._rooms;
    }
    run() {
        this.rooms.forEach((room) => {
            new towers_1.Towers(room).run();
            new market_1.Market(room).run();
        });
    }
}
exports.Rooms = Rooms;
//# sourceMappingURL=rooms.js.map