export class Find {
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
    return Find.findStructuresByType<StructureTerminal>(
      room,
      STRUCTURE_TERMINAL
    ).filter(
      terminal =>
        terminal.isActive() === true &&
        terminal.my === true &&
        terminal.cooldown === 0
    );
  }
}
