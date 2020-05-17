Object.defineProperty(exports, "__esModule", { value: true });
exports.Extractor = void 0;
const helpers_creep_1 = require("./helpers.creep");
const helpers_1 = require("./helpers");
class Extractor {
    static run(creep) {
        //// STATE MANAGEMENT
        if (creep.memory.transferring && helpers_creep_1.HelpersCreep.totalCarry(creep) === 0) {
            // If creep is transferring and he has no goods, then start extracting
            creep.memory.transferring = false;
            helpers_creep_1.HelpersCreep.logAction(creep, 'extract');
        }
        if (!creep.memory.transferring && helpers_creep_1.HelpersCreep.totalCarry(creep) > 0) {
            // If creep is not transferring (i.e. extracting) and he has any goods, then transfer them
            // It's good because we have terminal right after the extractor, so there's no travel time,
            // while there's a cooldown for an extractor structure. So, we're not wasting time.
            creep.memory.transferring = true;
            helpers_creep_1.HelpersCreep.logAction(creep, 'transfer');
        }
        //// LOGIC BY STATE
        if (creep.memory.transferring) {
            // currently, we are not using labs, so ignore this code.
            // var targets = creep.room.find(FIND_STRUCTURES, {
            //             filter: (structure) => {
            //                 return ([STRUCTURE_LAB].indexOf(structure.structureType) !== -1) &&
            //                     structure.mineralAmount < structure.mineralCapacity
            //                     && (structure.mineralType == RESOURCE_HYDROGEN || structure.mineralType == null);
            //             }
            //     });
            const terminals = helpers_1.HelpersFind.findStructuresByType(creep.room, STRUCTURE_TERMINAL);
            if (terminals.length === 1) {
                // only one terminal allowed per room
                const terminal = terminals[0];
                const myResource = creep.carry[RESOURCE_HYDROGEN]
                    ? RESOURCE_HYDROGEN
                    : RESOURCE_KEANIUM;
                const transferResult = creep.transfer(terminal, myResource);
                if (transferResult === ERR_NOT_IN_RANGE) {
                    creep.moveTo(terminal);
                }
                else if (transferResult !== OK) {
                    helpers_creep_1.HelpersCreep.logError(creep, `transfer to terminal failed with result: ${transferResult}`);
                }
            }
            else {
                helpers_creep_1.HelpersCreep.logError(creep, 'no terminal in room found');
            }
        }
        else {
            const mineral = helpers_1.HelpersFind.findClosestPath(creep.pos, creep.room, FIND_MINERALS);
            if (mineral === null) {
                helpers_creep_1.HelpersCreep.logError(creep, 'no mineral in room found');
                return;
            }
            const harvestResult = creep.harvest(mineral);
            if (harvestResult === ERR_NOT_IN_RANGE ||
                harvestResult === ERR_INVALID_TARGET) {
                creep.moveTo(mineral);
            }
            else if (harvestResult !== OK) {
                helpers_creep_1.HelpersCreep.logError(creep, `mineral harvesting failed with result: ${harvestResult}`);
            }
        }
    }
}
exports.Extractor = Extractor;
