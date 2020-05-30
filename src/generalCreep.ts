import {
  GET_ENERGY_PATH,
  HelpersCreep,
  UPGRADE_PATH,
  TRANSFER_PATH,
  BUILD_PATH,
} from './helpers.creep';
import {HelpersFind} from './helpers.find';
import {EnergySourcesConfig, ReplenishableStructures} from './ts';
import {EnergySource, CreepActivity} from './enums';

type ResourceObject =
  | StructureLink
  | StructureStorage
  | Source
  | Tombstone
  | Resource;

export class GeneralCreep {
  static run(
    creep: Creep,
    sources: EnergySourcesConfig = {
      sources: [
        EnergySource.link,
        EnergySource.storage,
        EnergySource.dropped,
        EnergySource.tombstone,
        EnergySource.mine,
      ],
    },
    activities: CreepActivity[] = [
      CreepActivity.replanishExtensionEnergy,
      CreepActivity.replanishSpawnEnergy,
      CreepActivity.build,
      CreepActivity.replanishLinkEnergy,
      CreepActivity.replanishStorageEnergy,
    ]
  ) {
    const jobs = [replanish, build, upgradeController];

    // try to get energy from link, storage or mine, depending on sources config
    function getEnergy(): boolean {
      function getResourceObject(
        energySource: EnergySource
      ): ResourceObject | null {
        switch (energySource) {
          case EnergySource.link:
            return HelpersFind.findClosestStructureByPathFromArray<
              StructureLink
            >(
              creep.pos,
              creep.room,
              HelpersFind.findLinksWithEnergy(creep.room)
            );
          case EnergySource.storage:
            return creep.room.storage &&
              creep.room.storage.store[RESOURCE_ENERGY]
              ? creep.room.storage
              : null;
          case EnergySource.mine:
            return (
              creep.pos.findClosestByPath(
                creep.room.find(FIND_SOURCES_ACTIVE)
              ) || null
            );
          case EnergySource.dropped:
            return (
              creep.pos.findClosestByPath(
                creep.room
                  .find(FIND_DROPPED_RESOURCES)
                  .filter(x => x.resourceType === RESOURCE_ENERGY)
              ) || null
            );
          case EnergySource.tombstone:
            return (
              creep.pos.findClosestByPath(
                creep.room
                  .find(FIND_DROPPED_RESOURCES)
                  .filter(x => x.resourceType === RESOURCE_ENERGY)
              ) || null
            );
          default:
            return null;
        }
      }

      function withdraw(
        energySource: EnergySource,
        resourceObject: ResourceObject
      ): ScreepsReturnCode | null {
        switch (energySource) {
          case EnergySource.link:
          case EnergySource.storage:
          case EnergySource.tombstone:
            return creep.withdraw(
              resourceObject as StructureLink | StructureStorage | Tombstone,
              RESOURCE_ENERGY
            );
          case EnergySource.mine:
            return creep.harvest(resourceObject as Source);
          case EnergySource.dropped:
            return creep.pickup(resourceObject as Resource);
          default:
            return null;
        }
      }

      return sources.sources.some(source => {
        const object = getResourceObject(source);
        if (object !== null) {
          const withdrawResult = withdraw(source, object);
          if (withdrawResult === ERR_NOT_IN_RANGE) {
            const moveResult = HelpersCreep.moveTo(
              creep,
              object.pos,
              GET_ENERGY_PATH
            );
            if (moveResult !== OK) {
              HelpersCreep.logError(creep, `can't move: ${moveResult}`);
            } else {
              return true;
            }
          } else if (withdrawResult !== OK) {
            HelpersCreep.logError(creep, `can't get energy: ${withdrawResult}`);
          } else {
            return true;
          }
        }
        return false;
      });
    }

    function upgradeController(): boolean {
      if (creep.room.controller === undefined) {
        HelpersCreep.logError(creep, 'no controller found');
        return false;
      }
      const upgradingResult = creep.upgradeController(creep.room.controller);
      if (upgradingResult === ERR_NOT_IN_RANGE) {
        HelpersCreep.moveTo(creep, creep.room.controller.pos, UPGRADE_PATH);
      } else if (upgradingResult !== OK) {
        HelpersCreep.logError(
          creep,
          `upgrading controller failed with result: ${upgradingResult}`
        );
        return false;
      }
      return true;
    }

    function replanish(): boolean {
      function replanishTarget(
        target: ConcreteStructure<ReplenishableStructures>
      ) {
        if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target, {visualizePathStyle: TRANSFER_PATH});
        }
      }

      function findTarget() {
        function findNotFullStructure(type: ReplenishableStructures) {
          return HelpersFind.findClosestStructureByPathFromArray<
            ConcreteStructure<ReplenishableStructures>
          >(
            creep.pos,
            creep.room,
            HelpersFind.findByFindConstant<FIND_MY_STRUCTURES>(
              creep.room,
              FIND_MY_STRUCTURES,
              structure => {
                if (type === structure.structureType) {
                  switch (structure.structureType) {
                    case STRUCTURE_SPAWN:
                    case STRUCTURE_EXTENSION:
                    case STRUCTURE_LINK:
                      return structure.energy < structure.energyCapacity;
                    case STRUCTURE_STORAGE:
                      return (
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                      );
                  }
                }
                return false;
              }
            ) as ConcreteStructure<ReplenishableStructures>[]
          );
        }

        const extension = findNotFullStructure(STRUCTURE_EXTENSION);
        if (
          activities.includes(CreepActivity.replanishExtensionEnergy) &&
          extension
        ) {
          return extension;
        }
        const spawn = findNotFullStructure(STRUCTURE_SPAWN);
        if (activities.includes(CreepActivity.replanishSpawnEnergy) && spawn) {
          return spawn;
        }
        const link = findNotFullStructure(STRUCTURE_LINK);
        if (activities.includes(CreepActivity.replanishLinkEnergy) && link) {
          return link;
        }
        const storage = findNotFullStructure(STRUCTURE_STORAGE);
        if (
          activities.includes(CreepActivity.replanishStorageEnergy) &&
          storage
        ) {
          return storage;
        }

        return false;
      }

      const target = findTarget();
      if (target) {
        replanishTarget(target);
        return true;
      }
      return false;
    }

    function build(): boolean {
      function findWeakWall() {
        return HelpersFind.findClosestStructureByPathFromArray<StructureWall>(
          creep.pos,
          creep.room,
          HelpersFind.findStructuresByType<StructureWall>(
            creep.room,
            STRUCTURE_WALL
          ).filter(wall => wall.hits < 100000)
        );
      }

      function findConstructionSite() {
        return HelpersFind.findClosestStructureByPathFromArray<
          ConstructionSite
        >(
          creep.pos,
          creep.room,
          HelpersFind.findByFindConstant<FIND_MY_CONSTRUCTION_SITES>(
            creep.room,
            FIND_MY_CONSTRUCTION_SITES
          ) as ConstructionSite[]
        );
      }

      if (activities.includes(CreepActivity.build)) {
        const weakWall = findWeakWall();
        if (weakWall) {
          if (creep.repair(weakWall) == ERR_NOT_IN_RANGE) {
            creep.moveTo(weakWall, {visualizePathStyle: BUILD_PATH});
          }
          return true;
        }

        const constructionSite = findConstructionSite();
        if (constructionSite) {
          if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
            creep.moveTo(constructionSite, {visualizePathStyle: BUILD_PATH});
          }
          return true;
        }
      }
      return false;
    }

    if (creep.memory.working && creep.carry.energy === 0) {
      creep.memory.working = false;
      creep.say('harvest');

      creep.memory.jobId = Math.floor(Math.random() * jobs.length);
    }

    if (
      !creep.memory.working &&
      HelpersCreep.totalCarry(creep) === creep.carryCapacity
    ) {
      creep.memory.working = true;
      creep.say('work');
    }

    if (creep.memory.working) {
      while (jobs[creep.memory.jobId || 0]() === false) {
        creep.memory.jobId =
          (creep.memory.jobId || 0) + 1 > jobs.length - 1
            ? 0
            : (creep.memory.jobId || 0) + 1;
      }
    } else {
      getEnergy() || HelpersCreep.logError(creep, 'IDLE');
    }
  }
}
