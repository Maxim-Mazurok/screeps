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
    static getRoomTotalEnergyForSpawning(room, rcl = 0) {
        const extensions = HelpersFind.findStructuresByType(room, STRUCTURE_EXTENSION);
        const spawns = HelpersFind.findStructuresByType(room, STRUCTURE_SPAWN);
        const totalEnergy = SPAWN_ENERGY_CAPACITY * spawns.length + EXTENSION_ENERGY_CAPACITY[rcl] * extensions.length;
        console.log(`Room ${room.name} has ${totalEnergy} energy for spawning in total`);
        return totalEnergy;
    }
}
exports.HelpersFind = HelpersFind;
//# sourceMappingURL=helpers.find.js.map