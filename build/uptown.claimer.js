Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
class RoleUptownClaimer {
    /** @param {Creep} creep **/
    static run(creep) {
        const flag = Game.flags[helpers_1.CLAIM_FLAG_NAME];
        if (flag.room && flag.room.name === creep.room.name && creep.room.controller !== undefined) {
            if (creep.claimController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(flag, helpers_1.CLAIM_PATH);
            }
        }
        else {
            creep.moveTo(flag, helpers_1.CLAIM_PATH);
        }
    }
}
exports.RoleUptownClaimer = RoleUptownClaimer;
//# sourceMappingURL=uptown.claimer.js.map