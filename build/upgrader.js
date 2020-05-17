Object.defineProperty(exports, "__esModule", { value: true });
exports.Upgrader = void 0;
const helpers_creep_1 = require("./helpers.creep");
const helpers_find_1 = require("./helpers.find");
class Upgrader {
    static run(creep, sources = {
        link: true,
        storage: true,
        mine: false,
    }) {
        function tryLink() {
            const link = helpers_find_1.HelpersFind.findClosestStructureByPathFromArray(creep.pos, creep.room, helpers_find_1.HelpersFind.findLinksWithEnergy(creep.room));
            if (link === null) {
                helpers_creep_1.HelpersCreep.logError(creep, 'no link with energy in room found');
                return false;
            }
            const withdrawalResult = creep.withdraw(link, RESOURCE_ENERGY);
            if (withdrawalResult === ERR_NOT_IN_RANGE ||
                withdrawalResult === ERR_INVALID_TARGET) {
                creep.moveTo(link, helpers_creep_1.HARVEST_PATH);
                return true;
            }
            else if (withdrawalResult !== OK) {
                helpers_creep_1.HelpersCreep.logError(creep, `energy withdrawal from link failed with result: ${withdrawalResult}`);
            }
            return false;
        }
        function tryStorage() {
            const storage = creep.room.storage;
            if (storage === undefined || storage.store[RESOURCE_ENERGY] === 0) {
                helpers_creep_1.HelpersCreep.logError(creep, 'no storage with energy in room found');
                return false;
            }
            const withdrawalResult = creep.withdraw(storage, RESOURCE_ENERGY);
            if (withdrawalResult === ERR_NOT_IN_RANGE ||
                withdrawalResult === ERR_INVALID_TARGET) {
                creep.moveTo(storage, helpers_creep_1.HARVEST_PATH);
                return true;
            }
            else if (withdrawalResult !== OK) {
                helpers_creep_1.HelpersCreep.logError(creep, `energy withdrawal from storage failed with result: ${withdrawalResult}`);
            }
            return false;
        }
        function tryMine() {
            const source = creep.pos.findClosestByPath(creep.room.find(FIND_SOURCES));
            if (source !== null) {
                const harvestResult = creep.harvest(source);
                if (harvestResult === ERR_NOT_IN_RANGE) {
                    const moveResult = creep.moveTo(source, helpers_creep_1.HARVEST_PATH);
                    if (moveResult !== OK) {
                        helpers_creep_1.HelpersCreep.logError(creep, `can't move to mine: ${moveResult}`);
                    }
                }
                else if (harvestResult !== OK) {
                    helpers_creep_1.HelpersCreep.logError(creep, `can't harvest: ${harvestResult}`);
                }
                return true;
            }
            return false;
        }
        function upgradeController() {
            if (creep.room.controller === undefined) {
                helpers_creep_1.HelpersCreep.logError(creep, 'no controller found');
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
        if (creep.memory.working ||
            helpers_creep_1.HelpersCreep.totalCarry(creep) === creep.carryCapacity) {
            creep.memory.working = true;
            upgradeController();
        }
        else {
            creep.memory.working = false;
            (sources.link && tryLink()) ||
                (sources.storage && tryStorage()) ||
                (sources.mine && tryMine()) ||
                helpers_creep_1.HelpersCreep.logError(creep, 'IDLE');
        }
    }
}
exports.Upgrader = Upgrader;
//# sourceMappingURL=upgrader.js.map