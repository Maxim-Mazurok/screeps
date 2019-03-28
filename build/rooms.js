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
            let maxHits;
            if (room.name === 'E48N17') {
                maxHits = 10000;
            }
            new towers_1.Towers(room).run(maxHits);
            new market_1.Market(room).run();
        });
    }
}
exports.Rooms = Rooms;
//# sourceMappingURL=rooms.js.map