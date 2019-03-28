export class Towers {
  private towers: StructureTower[] = [];

  constructor(room: Room) {
    this.towers = room.find<StructureTower>(FIND_STRUCTURES, {
      filter: (structure: Structure) => {
        return structure.structureType === STRUCTURE_TOWER;
      },
    });
  }

  run(maxHits: number = 500000) {
    this.towers.forEach((tower: StructureTower) => {
      const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      if (closestHostile) {
        tower.attack(closestHostile);
      } else {
        const closestDamagedStructure = tower.pos.findClosestByRange(
          FIND_STRUCTURES,
          {
            filter: (structure: Structure) =>
              structure.hits < structure.hitsMax && structure.hits < maxHits,
          }
        );
        if (closestDamagedStructure) {
          tower.repair(closestDamagedStructure);
        }
      }
    });
  }
}
