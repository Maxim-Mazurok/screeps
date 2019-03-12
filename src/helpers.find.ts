export class HelpersFind {
  static findStructuresByType<T extends Structure>(
    room: Room,
    structureType: StructureConstant
  ): T[] {
    return room.find<T>(FIND_STRUCTURES, {
      filter: (structure: Structure) =>
        structure.structureType === structureType,
    });
  }

  static findMyActiveReadyToUseTerminals(room: Room): StructureTerminal[] {
    return HelpersFind.findStructuresByType<StructureTerminal>(
      room,
      STRUCTURE_TERMINAL
    ).filter(
      terminal =>
        terminal.isActive() === true &&
        terminal.my === true &&
        terminal.cooldown === 0
    );
  }

  static getRoomTotalEnergyForSpawning(room: Room, rcl: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 = 0) {
    const extensions: StructureExtension[] = HelpersFind.findStructuresByType<StructureExtension>(room, STRUCTURE_EXTENSION);
    const spawns: StructureSpawn[] = HelpersFind.findStructuresByType<StructureSpawn>(room, STRUCTURE_SPAWN);
    const totalEnergy = SPAWN_ENERGY_CAPACITY * spawns.length + EXTENSION_ENERGY_CAPACITY[rcl] * extensions.length;
    console.log(`Room ${room.name} has ${totalEnergy} energy for spawning in total`);
    return totalEnergy;
  }
}
