import {HARVEST_PATH, HelpersCreep, UPGRADE_PATH} from './helpers.creep';
import {HelpersFind} from './helpers.find';

export class Upgrader {
  static run(
    creep: Creep,
    sources: {
      link: boolean;
      storage: boolean;
      mine: boolean;
    } = {
      link: true,
      storage: true,
      mine: false,
    }
  ) {
    function tryLink(): boolean {
      const link = HelpersFind.findClosestStructureByPathFromArray<
        StructureLink
      >(creep.pos, creep.room, HelpersFind.findLinksWithEnergy(creep.room));

      if (link === null) {
        HelpersCreep.logError(creep, 'no link with energy in room found');
        return false;
      }

      const withdrawalResult = creep.withdraw(link, RESOURCE_ENERGY);
      if (
        withdrawalResult === ERR_NOT_IN_RANGE ||
        withdrawalResult === ERR_INVALID_TARGET
      ) {
        creep.moveTo(link, HARVEST_PATH);
        return true;
      } else if (withdrawalResult !== OK) {
        HelpersCreep.logError(
          creep,
          `energy withdrawal from link failed with result: ${withdrawalResult}`
        );
      }

      return false;
    }

    function tryStorage(): boolean {
      const storage = creep.room.storage;

      if (storage === undefined || storage.store[RESOURCE_ENERGY] === 0) {
        HelpersCreep.logError(creep, 'no storage with energy in room found');
        return false;
      }

      const withdrawalResult = creep.withdraw(storage, RESOURCE_ENERGY);
      if (
        withdrawalResult === ERR_NOT_IN_RANGE ||
        withdrawalResult === ERR_INVALID_TARGET
      ) {
        creep.moveTo(storage, HARVEST_PATH);
        return true;
      } else if (withdrawalResult !== OK) {
        HelpersCreep.logError(
          creep,
          `energy withdrawal from storage failed with result: ${withdrawalResult}`
        );
      }

      return false;
    }

    function tryMine(): boolean {
      const source = creep.pos.findClosestByPath(creep.room.find(FIND_SOURCES));
      if (source !== null) {
        if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
          creep.moveTo(source, HARVEST_PATH);
        }
        return true;
      }
      return false;
    }

    function upgradeController() {
      if (creep.room.controller === undefined) {
        HelpersCreep.logError(creep, 'no controller found');
        return;
      }
      const upgradingResult = creep.upgradeController(creep.room.controller);
      if (upgradingResult === ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, UPGRADE_PATH);
      } else if (upgradingResult !== OK) {
        HelpersCreep.logError(
          creep,
          `upgrading controller failed with result: ${upgradingResult}`
        );
      }
    }

    if (HelpersCreep.totalCarry(creep) > 0) {
      upgradeController();
    } else if (
      (sources.link && tryLink()) ||
      (sources.storage && tryStorage()) ||
      (sources.mine && tryMine())
    ) {
      return;
    } else {
      HelpersCreep.logError(creep, 'IDLE');
    }
  }
}
