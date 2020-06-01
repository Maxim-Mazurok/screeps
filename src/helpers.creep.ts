import {sum} from 'lodash';

export class HelpersCreep {
  static totalCarry(creep: Creep): number {
    return sum(Object.values(creep.carry));
  }

  static logAction(creep: Creep, action = 'unknown action') {
    console.log(`${creep.name} || ${action}`);
    creep.say(action);
  }

  static logError(creep: Creep, errorMessage = 'unknown error') {
    console.log(`${creep.name} || ${creep.room.name} || ${errorMessage}`);
  }

  private static hasBodyPart(
    creep: Creep,
    bodyPartType: BodyPartConstant
  ): boolean {
    return (
      creep.body.filter((bodyPartDefinition: BodyPartDefinition) => {
        return bodyPartDefinition.type === bodyPartType;
      }).length > 0
    );
  }

  static canClaim(creep: Creep): boolean {
    return HelpersCreep.hasBodyPart(creep, CLAIM);
  }

  static clearNonExistingCreepsMemory() {
    for (const name of Object.keys(Memory.creeps)) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name];
      }
    }
  }

  static moveTo(
    creep: Creep,
    target: RoomPosition,
    pathStyle: PolyStyle
  ): CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | ERR_NOT_FOUND {
    const result = creep.moveTo(target, {visualizePathStyle: pathStyle});
    if (result !== OK) {
      HelpersCreep.logError(creep, `can't move: ${result}`);
    }
    return result;
  }

  static bodyCost(body: BodyPartConstant[]) {
    return body.reduce((cost, part) => cost + BODYPART_COST[part], 0);
  }

  static moveTimeByPartsOnPlain(parts: BodyPartConstant[]) {
    const terrainFactor = 1; // plain
    const weight = parts.filter(x => x !== MOVE).length;
    const moveParts = parts.filter(x => x === MOVE).length;
    return HelpersCreep.moveTime(terrainFactor, weight, moveParts);
  }

  static moveTime(
    terrainFactor: 0.5 | 1 | 5, // road, plain, swamp
    weight: number,
    moveParts: number
  ) {
    return Math.ceil((terrainFactor * weight) / moveParts);
  }
}

export const TRANSFER_PATH = {stroke: '#ffffff'};
export const GET_ENERGY_PATH = {stroke: '#ffff00'}; /// yellow
export const CLAIM_PATH = {stroke: '#ff00ff'};
export const BUILD_PATH = {stroke: '#000aff'};
export const UPGRADE_PATH = {stroke: '#fff000'};

export const CLAIM_FLAG_NAME = 'ClaimMe';
export const BUILD_FLAG_NAME = 'BuildMe';
