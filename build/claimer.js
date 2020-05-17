Object.defineProperty(exports, "__esModule", { value: true });
exports.ClaimBuilder = void 0;
const roleBuilder = require('./builder');
const helpers_1 = require("./helpers");
const upgrader_1 = require("./upgrader");
class ClaimBuilder {
    static run(creep) {
        const flag = Game.flags[helpers_1.CLAIM_FLAG_NAME];
        if (flag.room && flag.room.name !== creep.room.name) {
            creep.moveTo(flag, helpers_1.CLAIM_PATH);
        }
        else if (creep.room.controller &&
            creep.room.controller.my === false &&
            helpers_1.HelpersCreep.canClaim(creep)) {
            // should claim
            if (flag.room &&
                flag.room.name !== creep.room.name &&
                creep.room.controller !== undefined) {
                if (creep.claimController(creep.room.controller) !== OK) {
                    creep.moveTo(flag, helpers_1.CLAIM_PATH);
                }
            }
            else {
                creep.moveTo(flag, helpers_1.CLAIM_PATH);
            }
        }
        else if (flag.room && helpers_1.HelpersFind.findSomethingToBuild(flag.room)) {
            // should build
            roleBuilder.run(creep);
        }
        else {
            // should upgrade
            upgrader_1.Upgrader.run(creep, {
                link: false,
                storage: false,
                mine: true,
            });
        }
    }
}
exports.ClaimBuilder = ClaimBuilder;
//# sourceMappingURL=claimer.js.map