Object.defineProperty(exports, "__esModule", { value: true });
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
        const rcl = room.controller.level || 0;
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
            totalEnergyAvailable += extension.energy;
        });
        const spawns = HelpersFind.findStructuresByType(room, STRUCTURE_SPAWN);
        spawns.forEach((spawn) => {
            totalEnergyAvailable += spawn.energy;
        });
        console.log(`Room ${room.name} has ${totalEnergyAvailable} energy for spawning available`);
        return totalEnergyAvailable;
    }
    static getAllStore(store) {
        return lodash_1.sum(Object.values(store));
    }
    static getRoomTerminalFreeStorageAmount(room) {
        let freeStorage = 0;
        const terminals = HelpersFind.findStructuresByType(room, STRUCTURE_EXTENSION);
        terminals.forEach((terminal) => {
            freeStorage += terminal.storeCapacity - this.getAllStore(terminal.store);
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
    static findSomethingToBuild(room, maxHits = Infinity, wallsOnly = false) {
        return [
            ...this.findByFindConstant(room, FIND_STRUCTURES, object => object.hits < object.hitsMax &&
                object.hits < maxHits &&
                (wallsOnly ? object.structureType === STRUCTURE_WALL : true)),
            ...this.findByFindConstant(room, FIND_CONSTRUCTION_SITES),
        ];
    }
}
exports.HelpersFind = HelpersFind;
//# sourceMappingURL=helpers.find.js.map