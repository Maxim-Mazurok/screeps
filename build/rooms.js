Object.defineProperty(exports, "__esModule", { value: true });
const towers_1 = require("./towers");
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
        this.runTowers();
    }
    runTowers() {
        this.rooms.forEach((room) => {
            const towers = new towers_1.default(room);
            towers.run();
        });
    }
}
exports.default = Rooms;
//# sourceMappingURL=rooms.js.map