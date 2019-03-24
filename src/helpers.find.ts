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

  static getRoomTotalEnergyForSpawning(room: Room) {
    const rcl = room.controller!.level || 0;
    const extensions: StructureExtension[] = HelpersFind.findStructuresByType<
      StructureExtension
    >(room, STRUCTURE_EXTENSION);
    const spawns: StructureSpawn[] = HelpersFind.findStructuresByType<
      StructureSpawn
    >(room, STRUCTURE_SPAWN);
    const totalEnergy =
      SPAWN_ENERGY_CAPACITY * spawns.length +
      EXTENSION_ENERGY_CAPACITY[rcl] * extensions.length;
    console.log(
      `Room ${room.name} has ${totalEnergy} energy for spawning in total`
    );
    return totalEnergy;
  }

  static getRoomTotalEnergyForSpawningAvailable(room: Room) {
    let totalEnergyAvailable = 0;
    const extensions: StructureExtension[] = HelpersFind.findStructuresByType<
      StructureExtension
    >(room, STRUCTURE_EXTENSION);
    extensions.forEach((extension: StructureExtension) => {
      totalEnergyAvailable += extension.energy;
    });

    const spawns: StructureSpawn[] = HelpersFind.findStructuresByType<
      StructureSpawn
    >(room, STRUCTURE_SPAWN);
    spawns.forEach((spawn: StructureSpawn) => {
      totalEnergyAvailable += spawn.energy;
    });

    console.log(
      `Room ${
        room.name
      } has ${totalEnergyAvailable} energy for spawning available`
    );
    return totalEnergyAvailable;
  }

  static findByFindConstant<K extends FindConstant>(
    room: Room,
    findConstant: K
  ): Array<FindTypes[K]> {
    return room.find<K>(findConstant);
  }

  static findClosestPathToMineral<T extends FindConstant>(
    roomPosition: RoomPosition,
    room: Room,
    type: T
  ): FindTypes[T] | null {
    return roomPosition.findClosestByPath(
      HelpersFind.findByFindConstant<T>(room, type)
    );
  }
}
