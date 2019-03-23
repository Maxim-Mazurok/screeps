Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
class HelpersCreep {
    static totalCarry(creep) {
        return lodash_1.sum(Object.values(creep.carry));
    }
    static logAction(creep, action = 'unknown action') {
        console.log(`${creep.name} || ${action}`);
        creep.say(action);
    }
    /**
     * @deprecated
     */
    static logErrorDeprecated(creep, errorTemplateString, ...args) {
        console.log(errorTemplateString.apply([creep.name, creep.room.name, ...args]));
    }
    static logError(creep, errorMessage = 'unknown error') {
        console.log(`${creep.name} || ${creep.room.name} || ${errorMessage}`);
    }
    static hasBodyPart(creep, bodyPartType) {
        return creep.body.filter((bodyPartDefinition) => {
            return bodyPartDefinition.type === bodyPartType;
        }).length > 0;
    }
    static canClaim(creep) {
        return HelpersCreep.hasBodyPart(creep, CLAIM);
    }
}
exports.HelpersCreep = HelpersCreep;
exports.TRANSFER_PATH = { visualizePathStyle: { stroke: '#ffffff' } };
exports.HARVEST_PATH = { visualizePathStyle: { stroke: '#00ff00' } };
exports.CLAIM_PATH = { visualizePathStyle: { stroke: '#ff00ff' } };
exports.BUILD_PATH = { visualizePathStyle: { stroke: '#000aff' } };
exports.CLAIM_FLAG_NAME = 'ClaimMe';
exports.BUILD_FLAG_NAME = 'BuildMe';
//# sourceMappingURL=helpers.creep.js.map