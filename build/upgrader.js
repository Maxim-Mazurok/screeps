Object.defineProperty(exports, "__esModule", { value: true });
const helpers_creep_1 = require("./helpers.creep");
const helpers_find_1 = require("./helpers.find");
class Upgrader {
    static run(creep) {
        function tryLink() {
            const link = helpers_find_1.HelpersFind.findClosestStructureByPathFromArray(creep.pos, creep.room, helpers_find_1.HelpersFind.findLinksWithEnergy(creep.room));
            if (link === null) {
                helpers_creep_1.HelpersCreep.logError(creep, 'no link with energy in room found');
                return;
            }
            const withdrawalResult = creep.withdraw(link, RESOURCE_ENERGY);
            if (withdrawalResult === ERR_NOT_IN_RANGE ||
                withdrawalResult === ERR_INVALID_TARGET) {
                creep.moveTo(link, helpers_creep_1.HARVEST_PATH);
            }
            else if (withdrawalResult !== OK) {
                helpers_creep_1.HelpersCreep.logError(creep, `energy withdrawal from link failed with result: ${withdrawalResult}`);
            }
        }
        function upgradeController() {
            if (creep.room.controller === undefined) {
                helpers_creep_1.HelpersCreep.logError(creep, `no controller found`);
                return;
            }
            const upgradingResult = creep.upgradeController(creep.room.controller);
            if (upgradingResult === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, helpers_creep_1.UPGRADE_PATH);
            }
            else if (upgradingResult !== OK) {
                helpers_creep_1.HelpersCreep.logError(creep, `upgrading controller failed with result: ${upgradingResult}`);
            }
        }
        if (helpers_creep_1.HelpersCreep.totalCarry(creep) > 0) {
            tryLink();
        }
        else {
            upgradeController();
        }
    }
}
exports.Upgrader = Upgrader;
//# sourceMappingURL=upgrader.js.map