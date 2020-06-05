import {sum} from 'lodash';
import {RoomConfig} from './ts';

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
    const rcl = room.controller ? room.controller.level : 0;
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
      `Room ${room.name} has ${totalEnergyAvailable} energy for spawning available`
    );
    return totalEnergyAvailable;
  }

  static getAllStore(store: StoreDefinition): number {
    return sum(Object.values(store));
  }

  static getRoomTerminalFreeStorageAmount(room: Room) {
    let freeStorage = 0;
    const terminals: StructureTerminal[] = HelpersFind.findStructuresByType<
      StructureTerminal
    >(room, STRUCTURE_TERMINAL);
    terminals.forEach((terminal: StructureTerminal) => {
      freeStorage += terminal.storeCapacity - this.getAllStore(terminal.store);
    });

    console.log(
      `Room ${room.name} has ${freeStorage} free storage in terminal`
    );
    return freeStorage;
  }

  static findByFindConstant<K extends FindConstant>(
    room: Room,
    findConstant: K,
    filter: ((filterObject: AnyStructure) => boolean) | undefined = undefined
  ): Array<FindTypes[K]> {
    if (filter !== undefined) {
      return room.find<K>(findConstant, {
        filter,
      });
    }
    return room.find<K>(findConstant);
  }

  static findClosestPath<T extends FindConstant>(
    roomPosition: RoomPosition,
    room: Room,
    type: T
  ): FindTypes[T] | null {
    return roomPosition.findClosestByPath(
      HelpersFind.findByFindConstant<T>(room, type)
    );
  }

  static findClosestStructureByPathFromArray<
    T extends AnyStructure | ConstructionSite
  >(roomPosition: RoomPosition, room: Room, array: T[]): T | null {
    return roomPosition.findClosestByPath(array);
  }

  static findSomethingToBuild(
    room: Room,
    buildConfig: RoomConfig['build'] = {
      maxHits: Infinity,
      maxWallHits: Infinity,
      minDiff: 0,
    }
  ): Array<ConstructionSite | Structure> {
    // TODO: merge with tower code
    return [
      ...this.findByFindConstant(room, FIND_STRUCTURES, structure => {
        if (structure.structureType === STRUCTURE_WALL) {
          return structure.hits < buildConfig.maxWallHits;
        }
        return (
          structure.hits < structure.hitsMax &&
          structure.hits < buildConfig.maxHits &&
          Math.min(structure.hitsMax, buildConfig.maxHits) - structure.hits >=
            buildConfig.minDiff
        );
      }),
      ...this.findByFindConstant(room, FIND_CONSTRUCTION_SITES),
    ];
  }

  static findLinksWithEnergy(room: Room): StructureLink[] {
    return HelpersFind.findStructuresByType<StructureLink>(
      room,
      STRUCTURE_LINK
    ).filter((link: StructureLink) => link.energy > 0);
  }

  static findAllMyCreepsInRoom(room: Room): Creep[] {
    return Object.values(Game.creeps).filter(
      (creep: Creep) => creep.my && creep.room.name === room.name
    );
  }
}
