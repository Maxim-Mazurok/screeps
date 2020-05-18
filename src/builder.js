/* eslint-disable */
const General = require('./generalCreep');

roleBuilder = {
  /** @param {Creep} creep **/
  run: function (
    creep,
    sources = {
      mine: false,
    }
  ) {
    function tryMine() {
      const source = creep.pos.findClosestByPath(creep.room.find(FIND_SOURCES));
      if (source !== null) {
        const harvestResult = creep.harvest(source);
        if (harvestResult === ERR_NOT_IN_RANGE) {
          creep.moveTo(source);
        }
        return true;
      }
      return false;
    }

    //var isContainer = creep.room.lookAt(creep.pos.x, creep.pos.y).filter(x => x.type === 'structure' && x.structure.structureType === STRUCTURE_CONTAINER).length;
    if (creep.memory.building && creep.carry.energy == 0) {
      creep.memory.building = false;
      creep.say('harvest');
    }
    //if(!creep.memory.building && creep.carry.energy > 0) { //== creep.carryCapacity) {
    if (!creep.memory.building && _.sum(creep.carry) == creep.carryCapacity) {
      creep.memory.building = true;
      creep.say('build');
    }
    if (creep.memory.building) {
      if (creep.carry[RESOURCE_HYDROGEN] > 0) {
        var targets = creep.room.find(FIND_STRUCTURES, {
          filter: structure => {
            return (
              [STRUCTURE_LAB].indexOf(structure.structureType) !== -1 &&
              structure.mineralAmount < structure.mineralCapacity &&
              (structure.mineralType == RESOURCE_HYDROGEN ||
                structure.mineralType == null)
            );
          },
        });
        if (targets.length > 0) {
          const target = creep.pos.findClosestByPath(targets);
          if (creep.transfer(target, RESOURCE_HYDROGEN) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
          }
        }
      } else {
        // if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        //         creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
        //     }
        let foundFlag = false;
        const look = creep.room.lookAt(Game.flags['BuildMe']);
        look.forEach(function (lookObject) {
          if (lookObject.type == LOOK_CONSTRUCTION_SITES) {
            let target = lookObject.constructionSite;
            if (creep.build(target) == ERR_NOT_IN_RANGE) {
              creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            foundFlag = true;
            return;
          }
        });
        if (foundFlag) return;

        var source = creep.pos.findClosestByPath(FIND_SOURCES);
        if (
          false // &&
          //[ERR_NOT_IN_RANGE,ERR_INVALID_TARGET].indexOf(creep.harvest(source)) === -1
          //isContainer
        ) {
          let info = creep.room.lookAtArea(
            creep.pos.y - 1,
            creep.pos.x - 1,
            creep.pos.y + 1,
            creep.pos.x + 1
          );
          for (y in info) {
            for (x in info[y]) {
              ////console.log(JSON.stringify(info[y][x]));
              if (
                info[y][x].filter(
                  c =>
                    c.type === 'creep' ||
                    (c.type === 'terrain' && c.terrain === 'wall')
                ).length === 0
              ) {
                let filter = info[y][x].filter(
                  c =>
                    c.type === 'terrain' &&
                    (c.terrain === 'plain' || c.terrain === 'swamp')
                );
                if (filter.length > 0) {
                  creep.say(`${x}, ${y}`);
                  creep.moveTo(parseInt(x), parseInt(y));
                }
              }
            }
          }
        } else {
          let targets;
          if (creep.memory.room === '1') {
            targets = [
              ...creep.room.find(FIND_STRUCTURES, {
                //filter: object => (object.hits < object.hitsMax && object.hits > 25000 && object.hits < 500000)
                filter: object =>
                  object.hits < object.hitsMax &&
                  object.hits < 2000000 &&
                  object.structureType === STRUCTURE_WALL,
              }),
              ...creep.room.find(FIND_CONSTRUCTION_SITES),
            ];
          } else if (creep.memory.room === '2') {
            targets = [
              ...creep.room.find(FIND_STRUCTURES, {
                filter: object =>
                  object.hits < object.hitsMax &&
                  object.hits < 2000000 &&
                  object.structureType === STRUCTURE_WALL,
              }),
              ...creep.room.find(FIND_CONSTRUCTION_SITES),
            ];
          } else if (creep.memory.room === '3') {
            targets = [
              ...creep.room.find(FIND_STRUCTURES, {
                filter: object =>
                  object.hits < object.hitsMax && object.hits < 1000000,
              }),
              ...creep.room.find(FIND_CONSTRUCTION_SITES),
            ];
          } else {
            targets = [
              ...creep.room.find(FIND_STRUCTURES, {
                filter: object => object.hits < object.hitsMax,
              }),
              ...creep.room.find(FIND_CONSTRUCTION_SITES),
            ];
          }

          //targets = targets.filter(x => x.structureType !== 'lab' && x.structureType !== 'terminal');

          targets.sort(
            (a, b) =>
              (a.hasOwnProperty('progress') && a.progress !== undefined
                ? a.progress
                : a.hits) -
              (b.hasOwnProperty('progress') && b.progress !== undefined
                ? b.progress
                : b.hits)
          );

          if (targets.length > 0) {
            const target = creep.pos.findClosestByPath(targets);
            if (target !== null) {
              if (
                (target.progress !== undefined
                  ? creep.build(target)
                  : creep.repair(target)) == ERR_NOT_IN_RANGE
              ) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
              }
            } else {
              // TODO: fix that
              // General.run(creep);
            }
          } else {
            // TODO: fix that
            // General.run(creep);
          }
        }
      }
    } else {
      var targets = creep.room.find(FIND_STRUCTURES, {
        filter: structure => {
          return (
            [STRUCTURE_LINK].indexOf(structure.structureType) !== -1 &&
            structure.energy > 0
          );
        },
      });
      if (targets.length > 0) source = targets[0];
      if (source) {
        if (
          [ERR_NOT_IN_RANGE, ERR_INVALID_TARGET].indexOf(
            creep.withdraw(source, RESOURCE_ENERGY)
          ) !== -1
        ) {
          creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
        return;
      }
      var source = creep.pos.findClosestByPath(
        creep.room.find(FIND_DROPPED_RESOURCES)
      );
      if (!source) {
        //var source = creep.pos.findClosestByPath(creep.room.find(FIND_TOMBSTONES));
        var targets = creep.room.find(FIND_STRUCTURES, {
          filter: structure => {
            return (
              [STRUCTURE_CONTAINER, STRUCTURE_STORAGE].indexOf(
                structure.structureType
              ) !== -1 && structure.store[RESOURCE_ENERGY] > 0
            );
          },
        });
        if (targets.length > 0) source = targets[0];
        if (!source) {
          sources.mine && tryMine();
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
          // if (creep.memory.room == '2' || creep.memory.room == '3') {
          //     source = creep.pos.findClosestByPath(creep.room.find(FIND_SOURCES));
          //     if ([ERR_NOT_IN_RANGE, ERR_INVALID_TARGET].indexOf(creep.harvest(source)) !== -1) {
          //         creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
          //     }
          // }
        } else {
          if (
            Math.abs(creep.pos.x - source.pos.x) <= 1 &&
            Math.abs(creep.pos.y - source.pos.y) <= 1
          ) {
            creep.withdraw(source, RESOURCE_ENERGY);
          } else {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffffff'}});
          }
        }
      } else {
        if (
          [ERR_NOT_IN_RANGE, ERR_INVALID_TARGET].indexOf(
            creep.pickup(source)
          ) !== -1
        ) {
          creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
      }
    }
  },
};

module.exports = roleBuilder;
