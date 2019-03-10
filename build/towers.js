Object.defineProperty(exports, "__esModule", { value: true });
class Towers {
    constructor(room) {
        this.towers = [];
        this.towers = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType === STRUCTURE_TOWER;
            },
        });
    }
    run() {
        this.towers.forEach((tower) => {
            const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (closestHostile) {
                tower.attack(closestHostile);
            }
            else {
                const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => structure.hits < structure.hitsMax && structure.hits < 25000,
                });
                if (closestDamagedStructure) {
                    tower.repair(closestDamagedStructure);
                }
            }
        });
    }
}
exports.Towers = Towers;
//# sourceMappingURL=towers.js.map