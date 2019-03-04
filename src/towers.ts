export default class Towers {
    private towers: Array<StructureTower> = [];

    constructor(room: Room) {
        let tmp: Array<Structure | any> = room.find(FIND_STRUCTURES, {
            filter: (structure: Structure) => {
                return structure.structureType === STRUCTURE_TOWER
            }
        });
        this.towers = tmp;
    }

    public run() {
        this.towers.forEach((tower: StructureTower) => {
            const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (closestHostile) {
                tower.attack(closestHostile);
            } else {
                const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure: Structure) => structure.hits < structure.hitsMax && structure.hits < 25000
                });
                if (closestDamagedStructure) {
                    tower.repair(closestDamagedStructure);
                }
            }
        });
    }
}