Object.defineProperty(exports, "__esModule", { value: true });
exports.BUILD_FLAG_NAME = exports.CLAIM_FLAG_NAME = exports.UPGRADE_PATH = exports.BUILD_PATH = exports.CLAIM_PATH = exports.GET_ENERGY_PATH = exports.TRANSFER_PATH = exports.HelpersCreep = void 0;
const lodash_1 = require("lodash");
const helpers_find_1 = require("./helpers.find");
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
    static moveTimeByParts(parts, terrainFactor = 1) {
        const weight = parts.filter(x => x !== MOVE).length;
        const moveParts = parts.filter(x => x === MOVE).length;
        return HelpersCreep.moveTime(terrainFactor, weight, moveParts);
    }
    static moveTime(terrainFactor, weight, moveParts) {
        return Math.ceil((terrainFactor * weight) / moveParts);
    }
    static buildBody(room, terrainFactor) {
        function circleIndex() {
            lastBodyPartIndex =
                lastBodyPartIndex === bodyParts.length - 1 ? 0 : lastBodyPartIndex + 1;
        }
        function newBody(part) {
            return [...body, part];
        }
        function tryToAddToBody(part) {
            if (bodyParts.length >= 50)
                return; // Should contain 1 to 50 elements
            const newPart = part ? part : bodyParts[lastBodyPartIndex];
            if (HelpersCreep.moveTimeByParts(newBody(newPart), terrainFactor) > 1) {
                tryToAddToBody(MOVE);
            }
            if (HelpersCreep.bodyCost(newBody(newPart)) <= totalEnergy) {
                body.push(newPart);
                newPart !== MOVE && circleIndex();
                tryToAddToBody();
            }
        }
        const totalEnergy = helpers_find_1.HelpersFind.getRoomTotalEnergyForSpawningAvailable(room);
        const body = [MOVE, WORK, CARRY];
        const bodyParts = [WORK, CARRY];
        let lastBodyPartIndex = 0;
        tryToAddToBody();
        if (HelpersCreep.bodyCost(body) <= totalEnergy) {
            return body;
        }
        else {
            return null;
        }
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
