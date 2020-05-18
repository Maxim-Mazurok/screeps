Object.defineProperty(exports, "__esModule", { value: true });
exports.ClaimBuilder = void 0;
const roleBuilder = require('./builder');
const helpers_1 = require("./helpers");
const generalCreep_1 = require("./generalCreep");
const enums_1 = require("./enums");
class ClaimBuilder {
    static run(creep) {
        var _a, _b;
        const flag = Game.flags[helpers_1.CLAIM_FLAG_NAME];
        if (flag.room && flag.room.name !== creep.room.name) {
            creep.moveTo(flag);
        }
        else if (creep.room.controller &&
            creep.room.controller.my === false &&
            helpers_1.HelpersCreep.canClaim(creep)) {
            // should claim
            if (flag.room &&
                flag.room.name !== creep.room.name &&
                creep.room.controller !== undefined) {
                if (creep.claimController(creep.room.controller) !== OK) {
                    creep.moveTo(flag);
                }
            }
            else {
                creep.moveTo(flag);
            }
        }
        else if (flag.room &&
            helpers_1.HelpersFind.findSomethingToBuild(flag.room) &&
            (((_a = creep.room.controller) === null || _a === void 0 ? void 0 : _a.ticksToDowngrade) || Infinity) > 1500 &&
            (((_b = creep.room.controller) === null || _b === void 0 ? void 0 : _b.ticksToDowngrade) || Infinity) < 3000) {
            // should build
            roleBuilder.run(creep, { mine: true });
        }
        else {
            // should upgrade
            generalCreep_1.GeneralCreep.run(creep, {
                sources: [
                    enums_1.EnergySource.dropped,
                    enums_1.EnergySource.tombstone,
                    enums_1.EnergySource.mine,
                ],
            });
        }
    }
}
exports.ClaimBuilder = ClaimBuilder;
