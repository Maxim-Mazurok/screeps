Object.defineProperty(exports, "__esModule", { value: true });
exports.Rooms = void 0;
const towers_1 = require("./towers");
const market_1 = require("./market");
const lodash_1 = require("lodash");
const enums_1 = require("./enums");
const helpers_find_1 = require("./helpers.find");
const helpers_creep_1 = require("./helpers.creep");
class Rooms {
    constructor(roomsConfig) {
        this.rooms = [];
        this.roomsConfig = roomsConfig;
        for (const roomCoordinates of Object.keys(Game.rooms)) {
            const room = Game.rooms[roomCoordinates];
            this.rooms.push(room);
        }
    }
    run() {
        this.rooms.forEach((room) => {
            var _a, _b;
            const config = this.roomsConfig.find(x => x.roomName === room.name);
            new towers_1.Towers(room).run((_a = config === null || config === void 0 ? void 0 : config.build) === null || _a === void 0 ? void 0 : _a.maxHits, (_b = config === null || config === void 0 ? void 0 : config.build) === null || _b === void 0 ? void 0 : _b.maxWallHits);
            new market_1.Market(room).run();
            config && this.spawnCreeps(room, config);
        });
    }
    spawnCreeps(room, config) {
        function getCreepsByRole(role) {
            return lodash_1.filter(Game.creeps, (creep) => creep.memory.role === role && creep.memory.room === room.name);
        }
        // const harvesters = getCreepsByRole(CreepRole.harvester);
        // const upgraders = getCreepsByRole(CreepRole.upgrader);
        // const extractors = getCreepsByRole(CreepRole.extractor);
        // const energizers = getCreepsByRole(CreepRole.energizer);
        const spawn = room.find(FIND_MY_SPAWNS)[0];
        if (!spawn)
            return;
        if (config.claim && config.skills && config.skills[enums_1.CreepRole.claimer]) {
            const claimers = getCreepsByRole(enums_1.CreepRole.claimer);
            if (!claimers.length) {
                const claimerSkills = config.skills[enums_1.CreepRole.claimer];
                config.claim.forEach(({ to: claimRoomName }) => {
                    const newName = `Claimer_${room.name}->${claimRoomName}_${Game.time}`;
                    claimerSkills &&
                        spawn.spawnCreep(claimerSkills, newName, {
                            memory: { role: enums_1.CreepRole.claimer, room: room.name },
                        });
                });
            }
        }
        if (helpers_find_1.HelpersFind.findSomethingToBuild(room, config.build).length &&
            config.skills &&
            config.skills[enums_1.CreepRole.builder]) {
            const builders = getCreepsByRole(enums_1.CreepRole.builder);
            if (!builders.length) {
                const builderSkills = config.skills[enums_1.CreepRole.builder];
                const newName = `Builder_${room.name}_${Game.time}`;
                builderSkills &&
                    spawn.spawnCreep(builderSkills, newName, {
                        memory: { role: enums_1.CreepRole.builder, room: room.name },
                    });
            }
        }
        if (config.autoSpawn &&
            config.autoSpawn.enabled &&
            helpers_find_1.HelpersFind.findAllMyCreepsInRoom(room).length <
                config.autoSpawn.maxCreeps) {
            const body = helpers_creep_1.HelpersCreep.buildBody(room);
            if (body) {
                spawn.spawnCreep(body, Math.random().toString());
            }
        }
    }
}
exports.Rooms = Rooms;
