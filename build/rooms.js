Object.defineProperty(exports, "__esModule", { value: true });
const towers_1 = require("./towers");
const market_1 = require("./market");
class Rooms {
    constructor(game = Game) {
        this._rooms = [];
        for (const roomCoordinates in game.rooms) {
            const room = game.rooms[roomCoordinates];
            this._rooms.push(room);
        }
    }
    get rooms() {
        return this._rooms;
    }
    run() {
        this.rooms.forEach((room) => {
            new towers_1.default(room).run();
            new market_1.default(room).run();
        });
    }
}
exports.default = Rooms;
//# sourceMappingURL=rooms.js.map