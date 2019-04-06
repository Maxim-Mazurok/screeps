Object.defineProperty(exports, "__esModule", { value: true });
const towers_1 = require("./towers");
const market_1 = require("./market");
const lodash_1 = require("lodash");
class Rooms {
    constructor() {
        this._rooms = [];
        for (const roomCoordinates of Object.keys(Game.rooms)) {
            const room = Game.rooms[roomCoordinates];
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
    spawnCreeps(room) {
        function getCreepsByRole(role) {
            return lodash_1.filter(Game.creeps, (creep) => creep.memory.role === role && creep.memory.room === room.name);
        }
        const harvesters = getCreepsByRole(CreepRole.harvester);
        const builders = getCreepsByRole(CreepRole.builder);
        const upgraders = getCreepsByRole(CreepRole.upgrader);
        const extractors = getCreepsByRole(CreepRole.extractor);
        const energizers = getCreepsByRole(CreepRole.energizer);
        if (harvesters.length < 1) {
        }
    }
}
exports.Rooms = Rooms;
//# sourceMappingURL=rooms.js.map