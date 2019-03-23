Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
class RoleUptownBuilder {
    /** @param {Creep} creep **/
    static run(creep) {
        if (creep.room.controller && creep.room.controller.my === false) {
            const flag = Game.flags[helpers_1.CLAIM_FLAG_NAME];
            if (flag.room && flag.room.name === creep.room.name && creep.room.controller !== undefined) {
                if (creep.claimController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(flag, helpers_1.CLAIM_PATH);
                }
            }
            else {
                creep.moveTo(flag, helpers_1.CLAIM_PATH);
            }
        }
        else {
            const flag = Game.flags[helpers_1.BUILD_FLAG_NAME];
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
                    creep.room.lookAt(flag).some((lookObject) => {
                        if (lookObject.type == LOOK_CONSTRUCTION_SITES) {
                            const target = lookObject.constructionSite;
                            if (target !== undefined) {
                                if (creep.build(target) == ERR_NOT_IN_RANGE) {
                                    creep.moveTo(target, helpers_1.BUILD_PATH);
                                }
                                return true;
                            }
                        }
                        return false;
                    });
                }
                else {
                    creep.moveTo(flag);
                }
            }
            else {
                const source = creep.pos.findClosestByPath(creep.room.find(FIND_SOURCES));
                if (source !== null) {
                    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(source, helpers_1.HARVEST_PATH);
                    }
                }
            }
        }
    }
}
exports.RoleUptownBuilder = RoleUptownBuilder;
//# sourceMappingURL=uptown.builder.js.map