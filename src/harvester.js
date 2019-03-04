var roleBuilder = require('builder');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.transferring && creep.carry.energy == 0) {
            creep.memory.transferring = false;
            creep.say('harvest');
        }
        if(!creep.memory.transferring && creep.carry.energy == creep.carryCapacity) {
            creep.memory.transferring = true;
            creep.say('transfer');
        }
        if(creep.memory.transferring) {
            // creep.drop(RESOURCE_ENERGY);
            // return;
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return ([STRUCTURE_EXTENSION].indexOf(structure.structureType) !== -1) &&
                        structure.energy < structure.energyCapacity;
                }
            });
            if(targets.length > 0) {
                const target = creep.pos.findClosestByPath(targets);
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ([STRUCTURE_SPAWN].indexOf(structure.structureType) !== -1) &&
                            structure.energy < structure.energyCapacity;
                    }
                });
                if(targets.length > 0) {
                    const target = creep.pos.findClosestByPath(targets);
                    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                } else {
                    var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return ([STRUCTURE_TOWER].indexOf(structure.structureType) !== -1) &&
                                structure.energy < structure.energyCapacity - creep.carryCapacity;
                        }
                    });
                    if(targets.length > 0) {
                        const target = creep.pos.findClosestByPath(targets);
                        if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                    } else {
                        if (creep.memory.roomN == '1') {
                            var targets = Game.rooms['E47N16'].lookForAt('structure', 9, 31)[0];
                        } else if (creep.memory.roomN == '2') {
                            var targets = Game.rooms['E47N17'].lookForAt('structure', 40, 12)[0];
                        } else targets = false;
                        if(targets && targets.energy < targets.energyCapacity - creep.carryCapacity) {
                            const target = targets;
                            if (target !== null) {
                                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                                }
                            }
                        } else {
                            // var targets = creep.room.find(FIND_STRUCTURES, {
                            //     filter: (structure) => {
                            //         return ([STRUCTURE_CONTAINER].indexOf(structure.structureType) !== -1) &&
                            //             structure.store[RESOURCE_ENERGY] < structure.storeCapacity / 2;
                            //     }
                            // });
                            // const target = creep.pos.findClosestByPath(targets);
                            if (false && target !== null) {
                                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                                }
                            } else {
                                var targets = creep.room.find(FIND_STRUCTURES, {
                                    filter: (structure) => {
                                        return ([STRUCTURE_STORAGE].indexOf(structure.structureType) !== -1) &&
                                            structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
                                    }
                                });
                                if(targets.length > 0) {
                                    const target = creep.pos.findClosestByPath(targets);
                                    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                                    }
                                }
                                //roleBuilder.run(creep);
                            }
                        }
                    }
                }
            }
        }
        else {
            // console.log('harvest');
            /*var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return ([STRUCTURE_STORAGE].indexOf(structure.structureType) !== -1) &&
                        structure.store[RESOURCE_ENERGY] > 0;
                }
            });
            if (targets.length > 0) {
                source = targets[0];
                if(Math.abs(creep.pos.x - source.pos.x) <= 1 && Math.abs(creep.pos.y - source.pos.y) <= 1) {
                    creep.withdraw(source, RESOURCE_ENERGY);
                } else {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else {*/
            var source = false; // creep.pos.findClosestByPath(creep.room.find(FIND_DROPPED_RESOURCES));
            if (!source) {
                source = creep.pos.findClosestByPath(creep.room.find(FIND_SOURCES));
                let res = creep.harvest(source);
                if ([ERR_NOT_IN_RANGE, ERR_INVALID_TARGET].indexOf(res) !== -1) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                } else if (res === ERR_NOT_ENOUGH_RESOURCES) {
                    if (creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return ([STRUCTURE_EXTENSION].indexOf(structure.structureType) !== -1) &&
                                structure.energy < structure.energyCapacity;
                        }
                    }).length > 0 || creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return ([STRUCTURE_SPAWN].indexOf(structure.structureType) !== -1) &&
                                structure.energy < structure.energyCapacity;
                        }
                    }).length > 0) {
                        var targets = creep.room.find(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return ([STRUCTURE_STORAGE].indexOf(structure.structureType) !== -1) &&
                                    structure.store[RESOURCE_ENERGY] > 0;
                            }
                        });
                        if (targets.length > 0) {
                            source = targets[0];
                            if(Math.abs(creep.pos.x - source.pos.x) <= 1 && Math.abs(creep.pos.y - source.pos.y) <= 1) {
                                creep.withdraw(source, RESOURCE_ENERGY);
                            } else {
                                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffffff'}});
                            }
                        }
                    };
                }
            } else {
                if ([ERR_NOT_IN_RANGE, ERR_INVALID_TARGET].indexOf(creep.pickup(source)) !== -1) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
            //}
        }
    }
};

module.exports = roleHarvester;