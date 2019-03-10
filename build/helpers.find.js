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
}
exports.HelpersFind = HelpersFind;
//# sourceMappingURL=helpers.find.js.map