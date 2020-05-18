const roleBuilder = require('./builder');
import {CLAIM_FLAG_NAME, HelpersCreep, HelpersFind} from './helpers';
import {GeneralCreep} from './generalCreep';
import {EnergySource} from './enums';

export class ClaimBuilder {
  static run(creep: Creep) {
    const flag = Game.flags[CLAIM_FLAG_NAME];

    if (flag.room && flag.room.name !== creep.room.name) {
      creep.moveTo(flag);
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
          creep.moveTo(flag);
        }
      } else {
        creep.moveTo(flag);
      }
    } else if (
      flag.room &&
      HelpersFind.findSomethingToBuild(flag.room) &&
      (creep.room.controller?.ticksToDowngrade || Infinity) > 1500 &&
      (creep.room.controller?.ticksToDowngrade || 0) < 3000
    ) {
      // should build
      roleBuilder.run(creep, {mine: true});
    } else {
      // should upgrade
      GeneralCreep.run(creep, {
        sources: [
          EnergySource.dropped,
          EnergySource.tombstone,
          EnergySource.mine,
        ],
      });
    }
  }
}
