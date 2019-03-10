var roleExtractor = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.memory.transferring && _.sum(creep.carry) == 0) {
            creep.memory.transferring = false;
            creep.say('🔄 extract');
        }
        if (!creep.memory.transferring && _.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.transferring = true;
            creep.say('🚧 transfer');
        }
        if (creep.memory.transferring) {
            // var targets = creep.room.find(FIND_STRUCTURES, {
            //             filter: (structure) => {

            //                 return ([STRUCTURE_LAB].indexOf(structure.structureType) !== -1) &&
            //                     structure.mineralAmount < structure.mineralCapacity
            //                     && (structure.mineralType == RESOURCE_HYDROGEN || structure.mineralType == null);
            //             }
            //     });
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return ([STRUCTURE_TERMINAL].indexOf(structure.structureType) !== -1)
                }
            });
            if (targets.length > 0) {
                const target = creep.pos.findClosestByPath(targets);
                if (creep.transfer(target, RESOURCE_HYDROGEN) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                // nothing to do
            }
        } else {
            source = creep.pos.findClosestByPath(creep.room.find(FIND_MINERALS));
            if ([ERR_NOT_IN_RANGE, ERR_INVALID_TARGET].indexOf(creep.harvest(source)) !== -1) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = roleExtractor;