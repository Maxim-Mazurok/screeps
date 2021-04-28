Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpersFind = void 0;
const lodash_1 = require("lodash");
class HelpersFind {
    static findStructuresByType(room, structureType) {
        return room.find(FIND_STRUCTURES, {
            filter: (structure) => structure.structureType === structureType,
        });
    }
    static findMyActiveReadyToUseTerminals(room) {
        return HelpersFind.findStructuresByType(room, STRUCTURE_TERMINAL).filter(terminal => terminal.isActive() === true &&
            terminal.my === true &&
            terminal.cooldown === 0);
    }
    static getRoomTotalEnergyForSpawning(room) {
        const rcl = room.controller ? room.controller.level : 0;
        const extensions = HelpersFind.findStructuresByType(room, STRUCTURE_EXTENSION);
        const spawns = HelpersFind.findStructuresByType(room, STRUCTURE_SPAWN);
        const totalEnergy = SPAWN_ENERGY_CAPACITY * spawns.length +
            EXTENSION_ENERGY_CAPACITY[rcl] * extensions.length;
        console.log(`Room ${room.name} has ${totalEnergy} energy for spawning in total`);
        return totalEnergy;
    }
    static getRoomTotalEnergyForSpawningAvailable(room) {
        let totalEnergyAvailable = 0;
        const extensions = HelpersFind.findStructuresByType(room, STRUCTURE_EXTENSION);
        extensions.forEach((extension) => {
            totalEnergyAvailable += extension.store[RESOURCE_ENERGY];
        });
        const spawns = HelpersFind.findStructuresByType(room, STRUCTURE_SPAWN);
        spawns.forEach((spawn) => {
            totalEnergyAvailable += spawn.store[RESOURCE_ENERGY];
        });
        console.log(`Room ${room.name} has ${totalEnergyAvailable} energy for spawning available`);
        return totalEnergyAvailable;
    }
    static getAllStore(store) {
        return lodash_1.sum(Object.values(store));
    }
    static getRoomTerminalFreeStorageAmount(room) {
        let freeStorage = 0;
        const terminals = HelpersFind.findStructuresByType(room, STRUCTURE_TERMINAL);
        terminals.forEach((terminal) => {
            freeStorage +=
                terminal.store.getCapacity() - this.getAllStore(terminal.store);
        });
        console.log(`Room ${room.name} has ${freeStorage} free storage in terminal`);
        return freeStorage;
    }
    static findByFindConstant(room, findConstant, filter = undefined) {
        if (filter !== undefined) {
            return room.find(findConstant, {
                filter,
            });
        }
        return room.find(findConstant);
    }
    static findClosestPath(roomPosition, room, type) {
        return roomPosition.findClosestByPath(HelpersFind.findByFindConstant(room, type));
    }
    static findClosestStructureByPathFromArray(roomPosition, room, array) {
        return roomPosition.findClosestByPath(array);
    }
    static findSomethingToBuild(room, buildConfig = {
        maxHits: Infinity,
        maxWallHits: Infinity,
        minDiff: 0,
    }) {
        // TODO: merge with tower code
        return [
            ...this.findByFindConstant(room, FIND_STRUCTURES, structure => {
                if (structure.structureType === STRUCTURE_WALL) {
                    return structure.hits < buildConfig.maxWallHits;
                }
                return (structure.hits < structure.hitsMax &&
                    structure.hits < buildConfig.maxHits &&
                    Math.min(structure.hitsMax, buildConfig.maxHits) - structure.hits >=
                        buildConfig.minDiff);
            }),
            ...this.findByFindConstant(room, FIND_CONSTRUCTION_SITES),
        ];
    }
    static findLinksWithEnergy(room) {
        return HelpersFind.findStructuresByType(room, STRUCTURE_LINK).filter((link) => link.store[RESOURCE_ENERGY] > 0);
    }
    static findAllMyCreepsInRoom(room) {
        return Object.values(Game.creeps).filter((creep) => creep.my && creep.room.name === room.name);
    }
}
exports.HelpersFind = HelpersFind;
