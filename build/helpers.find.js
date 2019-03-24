Object.defineProperty(exports, "__esModule", { value: true });
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
    static findByFindConstant(room, findConstant) {
        return room.find(findConstant);
    }
    static findClosestPathToMineral(roomPosition, room, type) {
        return roomPosition.findClosestByPath(HelpersFind.findByFindConstant(room, type));
    }
}
exports.HelpersFind = HelpersFind;
//# sourceMappingURL=helpers.find.js.map