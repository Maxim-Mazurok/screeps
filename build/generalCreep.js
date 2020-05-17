Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralCreep = void 0;
const helpers_creep_1 = require("./helpers.creep");
const helpers_find_1 = require("./helpers.find");
const enums_1 = require("./enums");
class GeneralCreep {
    static run(creep, sources = {
        sources: [
            enums_1.EnergySource.link,
            enums_1.EnergySource.storage,
            enums_1.EnergySource.dropped,
            enums_1.EnergySource.tombstone,
            enums_1.EnergySource.mine,
        ],
    }) {
        // try to get energy from link, storage or mine, depending on sources config
        function getEnergy() {
            function getResourceObject(energySource) {
                switch (energySource) {
                    case enums_1.EnergySource.link:
                        return helpers_find_1.HelpersFind.findClosestStructureByPathFromArray(creep.pos, creep.room, helpers_find_1.HelpersFind.findLinksWithEnergy(creep.room));
                    case enums_1.EnergySource.storage:
                        return creep.room.storage &&
                            creep.room.storage.store[RESOURCE_ENERGY]
                            ? creep.room.storage
                            : null;
                    case enums_1.EnergySource.mine:
                        return (creep.pos.findClosestByPath(creep.room.find(FIND_SOURCES)) || null);
                    case enums_1.EnergySource.dropped:
                        return (creep.pos.findClosestByPath(creep.room
                            .find(FIND_DROPPED_RESOURCES)
                            .filter(x => x.resourceType === RESOURCE_ENERGY)) || null);
                    case enums_1.EnergySource.tombstone:
                        return (creep.pos.findClosestByPath(creep.room
                            .find(FIND_DROPPED_RESOURCES)
                            .filter(x => x.resourceType === RESOURCE_ENERGY)) || null);
                    default:
                        return null;
                }
            }
            function withdraw(energySource, resourceObject) {
                switch (energySource) {
                    case enums_1.EnergySource.link:
                    case enums_1.EnergySource.storage:
                    case enums_1.EnergySource.tombstone:
                        return creep.withdraw(resourceObject, RESOURCE_ENERGY);
                    case enums_1.EnergySource.mine:
                        return creep.harvest(resourceObject);
                    case enums_1.EnergySource.dropped:
                        return creep.pickup(resourceObject);
                    default:
                        return null;
                }
            }
            return sources.sources.some(source => {
                const object = getResourceObject(source);
                if (object !== null) {
                    const withdrawResult = withdraw(source, object);
                    if (withdrawResult === ERR_NOT_IN_RANGE) {
                        const moveResult = helpers_creep_1.HelpersCreep.moveTo(creep, object.pos, helpers_creep_1.GET_ENERGY_PATH);
                        if (moveResult !== OK) {
                            helpers_creep_1.HelpersCreep.logError(creep, `can't move: ${moveResult}`);
                        }
                        else {
                            return true;
                        }
                    }
                    else if (withdrawResult !== OK) {
                        helpers_creep_1.HelpersCreep.logError(creep, `can't get energy: ${withdrawResult}`);
                    }
                    else {
                        return true;
                    }
                }
                return false;
            });
        }
        function upgradeController() {
            if (creep.room.controller === undefined) {
                helpers_creep_1.HelpersCreep.logError(creep, 'no controller found');
                return;
            }
            const upgradingResult = creep.upgradeController(creep.room.controller);
            if (upgradingResult === ERR_NOT_IN_RANGE) {
                helpers_creep_1.HelpersCreep.moveTo(creep, creep.room.controller.pos, helpers_creep_1.UPGRADE_PATH);
            }
            else if (upgradingResult !== OK) {
                helpers_creep_1.HelpersCreep.logError(creep, `upgrading controller failed with result: ${upgradingResult}`);
            }
        }
        if (creep.memory.working && creep.carry.energy === 0) {
            creep.memory.working = false;
            creep.say('harvest');
        }
        if (!creep.memory.working &&
            helpers_creep_1.HelpersCreep.totalCarry(creep) === creep.carryCapacity) {
            creep.memory.working = true;
            creep.say('work');
        }
        if (creep.memory.working) {
            upgradeController();
        }
        else {
            getEnergy() || helpers_creep_1.HelpersCreep.logError(creep, 'IDLE');
        }
    }
}
exports.GeneralCreep = GeneralCreep;
