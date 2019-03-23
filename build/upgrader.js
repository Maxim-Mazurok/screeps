var roleUpgrader = {
    /** @param {Creep} creep **/
    run: function (creep) {
        ////console.log(creep.upgradeController(creep.room.controller));
        if (creep.upgradeController(creep.room.controller) !== ERR_NOT_IN_RANGE && creep.carry.energy > 0) {
            //do the job
        }
        else if (creep.carry.energy < creep.carryCapacity) {
            if (creep.carry[RESOURCE_HYDROGEN] > 0) {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ([STRUCTURE_TERMINAL].indexOf(structure.structureType) !== -1);
                    }
                });
                if (targets.length > 0) {
                    const target = creep.pos.findClosestByPath(targets);
                    if (creep.transfer(target, RESOURCE_HYDROGEN) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                    }
                }
            }
            else {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ([STRUCTURE_LINK].indexOf(structure.structureType) !== -1) &&
                            structure.energy > 0;
                    }
                });
                if (targets.length > 0)
                    source = creep.pos.findClosestByPath(targets);
                if (source) {
                    if ([ERR_NOT_IN_RANGE, ERR_INVALID_TARGET].indexOf(creep.withdraw(source, RESOURCE_ENERGY)) !== -1) {
                        creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
                    }
                    return;
                }
                var source = creep.pos.findClosestByPath(creep.room.find(FIND_DROPPED_RESOURCES));
                if (source) {
                    if ([ERR_NOT_IN_RANGE, ERR_INVALID_TARGET].indexOf(creep.pickup(source)) !== -1) {
                        creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
                    }
                    return;
                }
                var source = creep.pos.findClosestByPath(creep.room.find(FIND_TOMBSTONES));
                if (!source) {
                    var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return ([STRUCTURE_CONTAINER, STRUCTURE_STORAGE].indexOf(structure.structureType) !== -1) &&
                                structure.store[RESOURCE_ENERGY] > 0;
                        }
                    });
                    if (targets.length > 0)
                        source = targets[0];
                    if (!source) {
                        // var isContainer = creep.room.lookAt(creep.pos.x, creep.pos.y).filter(x => x.type === 'structure' && x.structure.structureType === STRUCTURE_CONTAINER).length;
                        // if (isContainer) {
                        //     let info = creep.room.lookAtArea(creep.pos.y - 1, creep.pos.x - 1, creep.pos.y + 1, creep.pos.x + 1);
                        //     for (y in info) {
                        //         for (x in info[y]) {
                        //             ////console.log(JSON.stringify(info[y][x]));
                        //             if (info[y][x].filter(c => c.type === 'creep' || c.type === 'terrain' && c.terrain === 'wall').length === 0) {
                        //                 let filter = info[y][x].filter(c => c.type === 'terrain' && (c.terrain === 'plain' || c.terrain === 'swamp'));
                        //                 if (filter.length > 0) {
                        //                     creep.say(`${x}, ${y}`);
                        //                     creep.moveTo(parseInt(x), parseInt(y));
                        //                 }
                        //             }
                        //         }
                        //     }
                        // }
                        //wait
                        if (creep.memory.roomN == '2' || creep.memory.roomN == '3') {
                            source = creep.pos.findClosestByPath(creep.room.find(FIND_SOURCES));
                            if ([ERR_NOT_IN_RANGE, ERR_INVALID_TARGET].indexOf(creep.harvest(source)) !== -1) {
                                creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
                            }
                        }
                    }
                    else {
                        if (Math.abs(creep.pos.x - source.pos.x) <= 1 && Math.abs(creep.pos.y - source.pos.y) <= 1) {
                            creep.withdraw(source, RESOURCE_ENERGY);
                        }
                        else {
                            creep.moveTo(source, { visualizePathStyle: { stroke: '#ffffff' } });
                        }
                    }
                }
                else {
                    if ([ERR_NOT_IN_RANGE].indexOf(creep.pickup(source)) !== -1) {
                        creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
                    }
                }
            }
        }
        else {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
        //creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffaa00'}});
    }
};
module.exports = roleUpgrader;
//# sourceMappingURL=upgrader.js.map