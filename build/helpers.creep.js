Object.defineProperty(exports, "__esModule", { value: true });
exports.BUILD_FLAG_NAME = exports.CLAIM_FLAG_NAME = exports.UPGRADE_PATH = exports.BUILD_PATH = exports.CLAIM_PATH = exports.GET_ENERGY_PATH = exports.TRANSFER_PATH = exports.HelpersCreep = void 0;
const lodash_1 = require("lodash");
class HelpersCreep {
    static totalCarry(creep) {
        return lodash_1.sum(Object.values(creep.carry));
    }
    static logAction(creep, action = 'unknown action') {
        console.log(`${creep.name} || ${action}`);
        creep.say(action);
    }
    static logError(creep, errorMessage = 'unknown error') {
        console.log(`${creep.name} || ${creep.room.name} || ${errorMessage}`);
    }
    static hasBodyPart(creep, bodyPartType) {
        return (creep.body.filter((bodyPartDefinition) => {
            return bodyPartDefinition.type === bodyPartType;
        }).length > 0);
    }
    static canClaim(creep) {
        return HelpersCreep.hasBodyPart(creep, CLAIM);
    }
    static clearNonExistingCreepsMemory() {
        for (const name of Object.keys(Memory.creeps)) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }
    }
    static moveTo(creep, target, pathStyle) {
        const result = creep.moveTo(target, { visualizePathStyle: pathStyle });
        if (result !== OK) {
            HelpersCreep.logError(creep, `can't move: ${result}`);
        }
        return result;
    }
    static bodyCost(body) {
        return body.reduce((cost, part) => cost + BODYPART_COST[part], 0);
    }
}
exports.HelpersCreep = HelpersCreep;
exports.TRANSFER_PATH = { stroke: '#ffffff' };
exports.GET_ENERGY_PATH = { stroke: '#ffff00' }; /// yellow
exports.CLAIM_PATH = { stroke: '#ff00ff' };
exports.BUILD_PATH = { stroke: '#000aff' };
exports.UPGRADE_PATH = { stroke: '#fff000' };
exports.CLAIM_FLAG_NAME = 'ClaimMe';
exports.BUILD_FLAG_NAME = 'BuildMe';
