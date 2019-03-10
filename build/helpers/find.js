Object.defineProperty(exports, "__esModule", { value: true });
class Find {
    static findStructuresByType(room, structureType) {
        return room.find(FIND_STRUCTURES, {
            filter: (structure) => structure.structureType === structureType
        });
    }
    static findMyActiveReadyToUseTerminals(room) {
        return Find
            .findStructuresByType(room, STRUCTURE_TERMINAL)
            .filter(terminal => terminal.isActive() === true &&
            terminal.my === true &&
            terminal.cooldown === 0);
    }
}
exports.default = Find;
//# sourceMappingURL=find.js.map