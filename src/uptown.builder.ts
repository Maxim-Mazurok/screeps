import { BUILD_FLAG_NAME, BUILD_PATH, HARVEST_PATH } from "./helpers";

export class RoleUptownBuilder {

  /** @param {Creep} creep **/
  public static run(creep: Creep) {
    const flag = Game.flags[BUILD_FLAG_NAME];

    if (creep.memory.building && creep.carry.energy === 0) {
      creep.memory.building = false;
      creep.say('harvest');
    }
    if (!creep.memory.building && creep.carry.energy === creep.carryCapacity) {
      creep.memory.building = true;
      creep.say('build');
    }

    if (creep.memory.building) {
      if (flag.room && creep.room.name === flag.room.name) {
        creep.room.lookAt(flag).some((lookObject: LookAtResult) => {
          if (lookObject.type == LOOK_CONSTRUCTION_SITES) {
            const target = lookObject.constructionSite;
            if (target !== undefined) {
              if (creep.build(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, BUILD_PATH);
              }
              return true;
            }
          }
          return false;
        });
      } else {
        creep.moveTo(flag);
      }
    } else {
      const source = creep.pos.findClosestByPath(creep.room.find(FIND_SOURCES));
      if (source !== null) {
        if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
          creep.moveTo(source, HARVEST_PATH);
        }
      }
    }
  }
}
