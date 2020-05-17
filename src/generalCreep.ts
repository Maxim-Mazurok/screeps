import {GET_ENERGY_PATH, HelpersCreep, UPGRADE_PATH} from './helpers.creep';
import {HelpersFind} from './helpers.find';
import {EnergySourcesConfig} from './ts';
import {EnergySource} from './enums';

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
    }
  ) {
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
              creep.pos.findClosestByPath(creep.room.find(FIND_SOURCES)) || null
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

    function upgradeController() {
      if (creep.room.controller === undefined) {
        HelpersCreep.logError(creep, 'no controller found');
        return;
      }
      const upgradingResult = creep.upgradeController(creep.room.controller);
      if (upgradingResult === ERR_NOT_IN_RANGE) {
        HelpersCreep.moveTo(creep, creep.room.controller.pos, UPGRADE_PATH);
      } else if (upgradingResult !== OK) {
        HelpersCreep.logError(
          creep,
          `upgrading controller failed with result: ${upgradingResult}`
        );
      }
    }

    if (creep.memory.working && creep.carry.energy === 0) {
      creep.memory.working = false;
      creep.say('harvest');
    }

    if (
      !creep.memory.working &&
      HelpersCreep.totalCarry(creep) === creep.carryCapacity
    ) {
      creep.memory.working = true;
      creep.say('work');
    }

    if (creep.memory.working) {
      upgradeController();
    } else {
      getEnergy() || HelpersCreep.logError(creep, 'IDLE');
    }
  }
}
