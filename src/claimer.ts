const roleBuilder = require('./builder');
import {
  CLAIM_FLAG_NAME,
  CLAIM_PATH,
  HelpersCreep,
  HelpersFind,
} from './helpers';
import {Upgrader} from './upgrader';

export class ClaimBuilder {
  static run(creep: Creep) {
    const flag = Game.flags[CLAIM_FLAG_NAME];

    if (flag.room && flag.room.name !== creep.room.name) {
      creep.moveTo(flag, CLAIM_PATH);
    } else if (
      creep.room.controller &&
      creep.room.controller.my === false &&
      HelpersCreep.canClaim(creep)
    ) {
      // should claim
      if (
        flag.room &&
        flag.room.name !== creep.room.name &&
        creep.room.controller !== undefined
      ) {
        if (creep.claimController(creep.room.controller) !== OK) {
          creep.moveTo(flag, CLAIM_PATH);
        }
      } else {
        creep.moveTo(flag, CLAIM_PATH);
      }
    } else if (flag.room && HelpersFind.findSomethingToBuild(flag.room)) {
      // should build
      roleBuilder.run(creep);
    } else {
      // should upgrade
      Upgrader.run(creep, {
        link: false,
        storage: false,
        mine: true,
      });
    }
  }
}
