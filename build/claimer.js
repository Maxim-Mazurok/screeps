Object.defineProperty(exports, "__esModule", { value: true });
exports.ClaimBuilder = void 0;
const helpers_1 = require("./helpers");
class ClaimBuilder {
    static run(creep) {
        function upgradeController() {
            if (creep.room.controller === undefined) {
                helpers_1.HelpersCreep.logError(creep, 'no controller found');
                return;
            }
            const upgradingResult = creep.upgradeController(creep.room.controller);
            if (upgradingResult === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, helpers_1.UPGRADE_PATH);
            }
            else if (upgradingResult !== OK) {
                helpers_1.HelpersCreep.logError(creep, `upgrading controller failed with result: ${upgradingResult}`);
            }
        }
        if (creep.room.controller &&
            creep.room.controller.my === false &&
            helpers_1.HelpersCreep.canClaim(creep)) {
            const flag = Game.flags[helpers_1.CLAIM_FLAG_NAME];
            if (flag.room &&
                flag.room.name === creep.room.name &&
                creep.room.controller !== undefined) {
                if (creep.claimController(creep.room.controller) !== OK) {
                    creep.moveTo(flag, helpers_1.CLAIM_PATH);
                }
            }
            else {
                creep.moveTo(flag, helpers_1.CLAIM_PATH);
            }
        }
        else {
            const flag = Game.flags[helpers_1.BUILD_FLAG_NAME];
            if (creep.memory.building && creep.carry.energy === 0) {
                creep.memory.building = false;
                creep.say('harvest');
            }
            if (!creep.memory.building &&
                creep.carry.energy === creep.carryCapacity) {
                creep.memory.building = true;
                creep.say('build');
            }
            if (creep.memory.building) {
                upgradeController();
            }
            else {
                const source = creep.pos.findClosestByPath(creep.room.find(FIND_SOURCES));
                if (source !== null) {
                    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(source, helpers_1.HARVEST_PATH);
                    }
                }
            }
        }
    }
}
exports.ClaimBuilder = ClaimBuilder;
//# sourceMappingURL=claimer.js.map