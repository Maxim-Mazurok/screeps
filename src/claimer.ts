import {
  BUILD_FLAG_NAME,
  BUILD_PATH,
  CLAIM_FLAG_NAME,
  CLAIM_PATH,
  HARVEST_PATH,
  HelpersCreep,
  UPGRADE_PATH,
} from './helpers';

export class ClaimBuilder {
  static run(creep: Creep) {
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

    if (
      creep.room.controller &&
      creep.room.controller.my === false &&
      HelpersCreep.canClaim(creep)
    ) {
      const flag = Game.flags[CLAIM_FLAG_NAME];
      if (
        flag.room &&
        flag.room.name === creep.room.name &&
        creep.room.controller !== undefined
      ) {
        if (creep.claimController(creep.room.controller) !== OK) {
          creep.moveTo(flag, CLAIM_PATH);
        }
      } else {
        creep.moveTo(flag, CLAIM_PATH);
      }
    } else {
      const flag = Game.flags[BUILD_FLAG_NAME];

      if (creep.memory.building && creep.carry.energy === 0) {
        creep.memory.building = false;
        creep.say('harvest');
      }
      if (
        !creep.memory.building &&
        creep.carry.energy === creep.carryCapacity
      ) {
        creep.memory.building = true;
        creep.say('build');
      }

      if (creep.memory.building) {
        upgradeController();
      } else {
        const source = creep.pos.findClosestByPath(
          creep.room.find(FIND_SOURCES)
        );
        if (source !== null) {
          if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source, HARVEST_PATH);
          }
        }
      }
    }
  }
}
