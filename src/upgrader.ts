import { HARVEST_PATH, HelpersCreep, UPGRADE_PATH } from './helpers.creep';
import { HelpersFind } from './helpers.find';

export class Upgrader {
  static run(creep: Creep) {
    function tryLink() {
      const link = HelpersFind.findClosestStructureByPathFromArray<
        StructureLink
      >(creep.pos, creep.room, HelpersFind.findLinksWithEnergy(creep.room));

      if (link === null) {
        HelpersCreep.logError(creep, 'no link with energy in room found');
        return;
      }

      const withdrawalResult = creep.withdraw(link, RESOURCE_ENERGY);
      if (
        withdrawalResult === ERR_NOT_IN_RANGE ||
        withdrawalResult === ERR_INVALID_TARGET
      ) {
        creep.moveTo(link, HARVEST_PATH);
      } else if (withdrawalResult !== OK) {
        HelpersCreep.logError(
          creep,
          `energy withdrawal from link failed with result: ${withdrawalResult}`
        );
      }
    }

    function upgradeController() {
      if (creep.room.controller === undefined) {
        HelpersCreep.logError(creep, `no controller found`);
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
    } else {
      tryLink();
    }
  }
}
