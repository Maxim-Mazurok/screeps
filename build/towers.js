Object.defineProperty(exports, "__esModule", { value: true });
exports.Towers = void 0;
class Towers {
    constructor(room) {
        this.towers = [];
        this.towers = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType === STRUCTURE_TOWER;
            },
        });
    }
    run(maxHits = 500000) {
        this.towers.forEach((tower) => {
            const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (closestHostile) {
                tower.attack(closestHostile);
            }
            else {
                const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => structure.hits < structure.hitsMax && structure.hits < maxHits,
                });
                const weakStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => structure.hits < structure.hitsMax && structure.hits < 100,
                });
                if (weakStructure) {
                    tower.repair(weakStructure);
                }
                else if (closestDamagedStructure) {
                    tower.repair(closestDamagedStructure);
                }
            }
        });
    }
}
exports.Towers = Towers;
//# sourceMappingURL=towers.js.map