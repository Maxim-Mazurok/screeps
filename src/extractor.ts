import { HARVEST_PATH, HelpersCreep, TRANSFER_PATH } from './helpers.creep';
import { HelpersFind } from './helpers';

export class Extractor {
  run(creep: Creep) {
    //// STATE MANAGEMENT
    if (creep.memory.transferring && HelpersCreep.totalCarry(creep) === 0) {
      // If creep is transferring and he has no goods, then start extracting
      creep.memory.transferring = false;
      HelpersCreep.logAction(creep, 'extract');
    }
    if (!creep.memory.transferring && HelpersCreep.totalCarry(creep) > 0) {
      // If creep is not transferring (i.e. extracting) and he has any goods, then transfer them
      // It's good because we have terminal right after the extractor, so there's no travel time,
      // while there's a cooldown for an extractor structure. So, we're not wasting time.
      creep.memory.transferring = true;
      HelpersCreep.logAction(creep, 'transfer');
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

      const terminals = HelpersFind.findStructuresByType<StructureTerminal>(
        creep.room,
        STRUCTURE_TERMINAL
      );
      if (terminals.length === 1) {
        // only one terminal allowed per room
        const terminal = terminals[0];
        const myResource = creep.carry[RESOURCE_HYDROGEN] !== undefined ? RESOURCE_HYDROGEN : RESOURCE_KEANIUM;
        const transferResult = creep.transfer(terminal, myResource);
        if (transferResult === ERR_NOT_IN_RANGE) {
          creep.moveTo(terminal, TRANSFER_PATH);
        } else if (transferResult !== OK) {
          HelpersCreep.logError(
            creep,
            `transfer to terminal failed with result: ${transferResult}`
          );
        }
      } else {
        HelpersCreep.logError(creep, 'no terminal in room found');
      }
    } else {
      const mineral = HelpersFind.findClosestPath<FIND_MINERALS>(
        creep.pos,
        creep.room,
        FIND_MINERALS
      );
      if (mineral === null) {
        HelpersCreep.logError(creep, 'no mineral in room found');
        return;
      }
      const harvestResult = creep.harvest(mineral);
      if (
        harvestResult === ERR_NOT_IN_RANGE ||
        harvestResult === ERR_INVALID_TARGET
      ) {
        creep.moveTo(mineral, HARVEST_PATH);
      } else if (harvestResult !== OK) {
        HelpersCreep.logError(
          creep,
          `mineral harvesting failed with result: ${harvestResult}`
        );
      }
    }
  }
}
