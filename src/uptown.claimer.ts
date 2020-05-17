import {CLAIM_FLAG_NAME, CLAIM_PATH} from './helpers';

export class RoleClaimer {
  static run(creep: Creep) {
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
  }
}
