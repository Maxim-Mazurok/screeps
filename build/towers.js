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
    run(maxHits = 1000000, maxWallHits = 2000000) {
        this.towers.forEach((tower) => {
            const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (closestHostile) {
                tower.attack(closestHostile);
            }
            else {
                const weakStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => structure.hits < structure.hitsMax && structure.hits < 100,
                });
                if (weakStructure) {
                    tower.repair(weakStructure);
                }
                else {
                    const damagedStructures = tower.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            if (structure.structureType === STRUCTURE_WALL) {
                                return structure.hits < maxWallHits;
                            }
                            return structure.hits < structure.hitsMax && structure.hits < maxHits;
                        },
                    });
                    const target = damagedStructures
                        .map(structure => ({
                        structure,
                        damagePercent: structure.structureType === STRUCTURE_WALL
                            ? 1 - structure.hits / maxWallHits
                            : 1 - structure.hits / Math.min(structure.hitsMax, maxHits),
                        distance: tower.pos.getRangeTo(structure)
                    }))
                        .sort((a, b) => {
                        if (Math.abs(a.damagePercent - b.damagePercent) > 0.2) {
                            return b.damagePercent - a.damagePercent;
                        }
                        return a.distance - b.distance;
                    })[0];
                    if (target) {
                        tower.repair(target.structure);
                    }
                }
            }
        });
    }
}
exports.Towers = Towers;
