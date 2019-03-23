import { CLAIM_FLAG_NAME, CLAIM_PATH } from "./helpers";

export class RoleUptownClaimer {

  /** @param {Creep} creep **/
  public static run(creep: Creep) {
    const flag = Game.flags[CLAIM_FLAG_NAME];
    if (flag.room === creep.room && creep.room.controller !== undefined) {
      if (creep.claimController(creep.room.controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(flag, CLAIM_PATH);
      }
    } else {
      creep.moveTo(flag, CLAIM_PATH);
    }
  }
}
