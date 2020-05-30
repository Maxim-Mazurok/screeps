Object.defineProperty(exports, "__esModule", { value: true });
exports.Rooms = void 0;
const towers_1 = require("./towers");
const market_1 = require("./market");
const lodash_1 = require("lodash");
const enums_1 = require("./enums");
const helpers_1 = require("./helpers");
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
            const config = this.roomsConfig.find(x => x.roomName === room.name);
            new towers_1.Towers(room).run();
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
        if (helpers_1.HelpersFind.findSomethingToBuild(room) &&
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
            helpers_1.HelpersFind.findAllMyCreepsInRoom(room).length <
                config.autoSpawn.maxCreeps) {
            const totalEnergy = helpers_1.HelpersFind.getRoomTotalEnergyForSpawningAvailable(room);
            const bodyParts = [];
            const bodyPartsOrder = [MOVE, WORK, CARRY];
            let lastBodyPartIndex = bodyParts.length - 1;
            while (helpers_1.HelpersCreep.bodyCost(bodyParts) < totalEnergy) {
                lastBodyPartIndex =
                    lastBodyPartIndex === bodyParts.length - 1
                        ? 0
                        : lastBodyPartIndex + 1;
                if (helpers_1.HelpersCreep.bodyCost([
                    ...bodyParts,
                    bodyPartsOrder[lastBodyPartIndex],
                ]) <= totalEnergy) {
                    bodyParts.push(bodyPartsOrder[lastBodyPartIndex]);
                }
                else {
                    break;
                }
            }
            spawn.spawnCreep(bodyPartsOrder, Math.random().toString());
        }
    }
}
exports.Rooms = Rooms;
