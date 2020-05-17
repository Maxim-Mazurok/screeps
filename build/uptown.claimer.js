Object.defineProperty(exports, '__esModule', {value: true});
exports.RoleClaimer = void 0;
const helpers_1 = require('./helpers');
class RoleClaimer {
  static run(creep) {
    const flag = Game.flags[helpers_1.CLAIM_FLAG_NAME];
    if (
      flag.room &&
      flag.room.name === creep.room.name &&
      creep.room.controller !== undefined
    ) {
      if (creep.claimController(creep.room.controller) !== OK) {
        creep.moveTo(flag, helpers_1.CLAIM_PATH);
      }
    } else {
      creep.moveTo(flag, helpers_1.CLAIM_PATH);
    }
  }
}
exports.RoleClaimer = RoleClaimer;
//# sourceMappingURL=uptown.claimer.js.map
