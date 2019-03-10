var roleUptownHarvester = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.memory.transferring && creep.carry.energy === 0) {
            creep.memory.transferring = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.transferring && creep.carry.energy === creep.carryCapacity) {
            creep.memory.transferring = true;
            creep.say('🚧 transfer');
        }
        if (creep.memory.transferring) {
            const look = creep.room.lookAt(Game.flags['BuildMe']);
            look.forEach(function (lookObject) {
                if (lookObject.type == LOOK_CONSTRUCTION_SITES) {
                    let target = lookObject.constructionSite;
                    if (creep.build(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            });
            creep.moveTo(Game.flags['BuildMe']);
        } else {
            var source = creep.pos.findClosestByPath(creep.room.find(FIND_DROPPED_RESOURCES));
            console.log(source);
            if (!source) {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ([STRUCTURE_CONTAINER, STRUCTURE_STORAGE].indexOf(structure.structureType) !== -1) &&
                            structure.store[RESOURCE_ENERGY] > 0;
                    }
                });
                if (targets.length > 0) source = targets[0];
                if (!source) {
                    source = creep.pos.findClosestByPath(creep.room.find(FIND_SOURCES));
                    if ([ERR_NOT_IN_RANGE, ERR_INVALID_TARGET].indexOf(creep.harvest(source)) !== -1) {
                        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                } else {
                    if (Math.abs(creep.pos.x - source.pos.x) <= 1 && Math.abs(creep.pos.y - source.pos.y) <= 1) {
                        creep.withdraw(source, RESOURCE_ENERGY);
                    } else {
                        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            } else {
                if ([ERR_NOT_IN_RANGE, ERR_INVALID_TARGET].indexOf(creep.pickup(source)) !== -1) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }

            // source = creep.pos.findClosestByPath(creep.room.find(FIND_SOURCES));
            // if ([ERR_NOT_IN_RANGE, ERR_INVALID_TARGET].indexOf(creep.harvest(source)) !== -1) {
            //     creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            // }
            // if ([ERR_NOT_IN_RANGE, ERR_INVALID_TARGET].indexOf(creep.harvest(Game.flags['UptownEnergy'])) !== -1) {
            //     creep.moveTo(Game.flags['UptownEnergy'], {visualizePathStyle: {stroke: '#ffaa00'}});
            // }
        }
    }
};

module.exports = roleUptownHarvester;