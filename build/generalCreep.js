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
            enums_1.EnergySource.ruin,
            enums_1.EnergySource.mine,
        ],
    }, activities = [
        enums_1.CreepActivity.replenishExtensionEnergy,
        enums_1.CreepActivity.replenishSpawnEnergy,
        enums_1.CreepActivity.build,
        enums_1.CreepActivity.replenishTowerEnergy,
        enums_1.CreepActivity.replenishLinkEnergy,
        enums_1.CreepActivity.replenishStorageEnergy,
    ]) {
        const jobs = [replenish.bind(null, activities), build, upgradeController];
        // try to get energy from link, storage or mine, depending on sources config
        function getEnergy() {
            function getResourceObject(energySource) {
                switch (energySource) {
                    case enums_1.EnergySource.link: {
                        const ignoreLinks = sources.ignoreLinks === undefined ? [] : sources.ignoreLinks;
                        let linksWithEnergy = helpers_find_1.HelpersFind.findLinksWithEnergy(creep.room);
                        if (ignoreLinks.length !== 0) {
                            linksWithEnergy = linksWithEnergy.filter(x => ignoreLinks.indexOf(x.pos) === -1);
                        }
                        return helpers_find_1.HelpersFind.findClosestStructureByPathFromArray(creep.pos, creep.room, linksWithEnergy);
                    }
                    case enums_1.EnergySource.storage:
                        return creep.room.storage &&
                            creep.room.storage.store[RESOURCE_ENERGY]
                            ? creep.room.storage
                            : null;
                    case enums_1.EnergySource.mine:
                        return (creep.pos.findClosestByPath(creep.room.find(FIND_SOURCES_ACTIVE)) || null);
                    case enums_1.EnergySource.dropped: {
                        const closestByPath = creep.pos.findClosestByPath(creep.room
                            .find(FIND_DROPPED_RESOURCES)
                            .filter(x => x.resourceType === RESOURCE_ENERGY));
                        if (sources.maxPathToDropped === undefined)
                            return closestByPath;
                        if (closestByPath === null)
                            return closestByPath;
                        return creep.room.findPath(creep.pos, closestByPath.pos).length >
                            sources.maxPathToDropped
                            ? null
                            : closestByPath;
                    }
                    case enums_1.EnergySource.tombstone:
                        return (creep.pos.findClosestByPath(creep.room
                            .find(FIND_TOMBSTONES)
                            .filter(x => x.store[RESOURCE_ENERGY] > 0)) || null);
                    case enums_1.EnergySource.ruin:
                        return (creep.pos.findClosestByPath(creep.room
                            .find(FIND_RUINS)
                            .filter(x => x.store[RESOURCE_ENERGY] > 0)) || null);
                    default:
                        return null;
                }
            }
            function withdraw(energySource, resourceObject) {
                switch (energySource) {
                    case enums_1.EnergySource.link:
                    case enums_1.EnergySource.storage:
                    case enums_1.EnergySource.tombstone:
                    case enums_1.EnergySource.ruin:
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
                return false;
            }
            const upgradingResult = creep.upgradeController(creep.room.controller);
            if (upgradingResult === ERR_NOT_IN_RANGE) {
                helpers_creep_1.HelpersCreep.moveTo(creep, creep.room.controller.pos, helpers_creep_1.UPGRADE_PATH);
            }
            else if (upgradingResult !== OK) {
                helpers_creep_1.HelpersCreep.logError(creep, `upgrading controller failed with result: ${upgradingResult}`);
                return false;
            }
            return true;
        }
        function replenish(activities) {
            function replenishTarget(target) {
                if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: helpers_creep_1.TRANSFER_PATH });
                }
            }
            function findTarget() {
                function findNotFullStructure(type) {
                    return helpers_find_1.HelpersFind.findClosestStructureByPathFromArray(creep.pos, creep.room, helpers_find_1.HelpersFind.findByFindConstant(creep.room, FIND_MY_STRUCTURES, structure => {
                        if (type === structure.structureType) {
                            switch (structure.structureType) {
                                case STRUCTURE_SPAWN:
                                case STRUCTURE_EXTENSION:
                                case STRUCTURE_LINK:
                                case STRUCTURE_TOWER: // TODO: maybe, only replenish towers that have TOTAL - CURRENT >= CREEP.energy so that creep will save travel on 2 energy points delivery, etc.
                                    return structure.energy < structure.energyCapacity;
                                case STRUCTURE_STORAGE:
                                    return (structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
                            }
                        }
                        return false;
                    }));
                }
                const extension = findNotFullStructure(STRUCTURE_EXTENSION);
                if (activities.includes(enums_1.CreepActivity.replenishExtensionEnergy) &&
                    extension) {
                    return extension;
                }
                const spawn = findNotFullStructure(STRUCTURE_SPAWN);
                if (activities.includes(enums_1.CreepActivity.replenishSpawnEnergy) && spawn) {
                    return spawn;
                }
                const tower = findNotFullStructure(STRUCTURE_TOWER);
                if (activities.includes(enums_1.CreepActivity.replenishTowerEnergy) && tower) {
                    return tower;
                }
                const link = findNotFullStructure(STRUCTURE_LINK);
                if (activities.includes(enums_1.CreepActivity.replenishLinkEnergy) && link) {
                    return link;
                }
                const storage = findNotFullStructure(STRUCTURE_STORAGE);
                if (activities.includes(enums_1.CreepActivity.replenishStorageEnergy) &&
                    storage) {
                    return storage;
                }
                return false;
            }
            const target = findTarget();
            if (target) {
                replenishTarget(target);
                return true;
            }
            return false;
        }
        function build() {
            function findWeakWall() {
                return helpers_find_1.HelpersFind.findClosestStructureByPathFromArray(creep.pos, creep.room, helpers_find_1.HelpersFind.findStructuresByType(creep.room, STRUCTURE_WALL).filter(wall => wall.hits < 100000));
            }
            function findConstructionSite() {
                return helpers_find_1.HelpersFind.findClosestStructureByPathFromArray(creep.pos, creep.room, helpers_find_1.HelpersFind.findByFindConstant(creep.room, FIND_MY_CONSTRUCTION_SITES));
            }
            if (activities.includes(enums_1.CreepActivity.build)) {
                const weakWall = findWeakWall();
                if (weakWall) {
                    if (creep.repair(weakWall) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(weakWall, { visualizePathStyle: helpers_creep_1.BUILD_PATH });
                    }
                    return true;
                }
                const constructionSite = findConstructionSite();
                if (constructionSite) {
                    if (creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(constructionSite, { visualizePathStyle: helpers_creep_1.BUILD_PATH });
                    }
                    return true;
                }
            }
            return false;
        }
        if (creep.memory.working && creep.carry.energy === 0) {
            creep.memory.working = false;
            creep.say('harvest');
            creep.memory.jobId = Math.floor(Math.random() * jobs.length);
        }
        if (!creep.memory.working &&
            helpers_creep_1.HelpersCreep.totalCarry(creep) === creep.carryCapacity) {
            creep.memory.working = true;
            creep.say('work');
        }
        if (creep.memory.working) {
            if (replenish([
                enums_1.CreepActivity.replenishExtensionEnergy,
                enums_1.CreepActivity.replenishSpawnEnergy,
            ]))
                return;
            while (jobs[creep.memory.jobId || 0]() === false) {
                creep.memory.jobId =
                    (creep.memory.jobId || 0) + 1 > jobs.length - 1
                        ? 0
                        : (creep.memory.jobId || 0) + 1;
            }
        }
        else {
            getEnergy() || helpers_creep_1.HelpersCreep.logError(creep, 'IDLE');
        }
    }
}
exports.GeneralCreep = GeneralCreep;
