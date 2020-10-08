import {sum} from 'lodash';
import {HelpersFind} from './helpers.find';

type TerrainFactor = 0.5 | 1 | 5; // road, plain, swamp

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

  static moveTimeByParts(
    parts: BodyPartConstant[],
    terrainFactor: TerrainFactor = 1
  ) {
    const weight = parts.filter(x => x !== MOVE).length;
    const moveParts = parts.filter(x => x === MOVE).length;
    return HelpersCreep.moveTime(terrainFactor, weight, moveParts);
  }

  static moveTime(
    terrainFactor: TerrainFactor,
    weight: number,
    moveParts: number
  ) {
    return Math.ceil((terrainFactor * weight) / moveParts);
  }

  static buildBody(
    room: Room,
    terrainFactor: TerrainFactor
  ): BodyPartConstant[] | null {
    function circleIndex() {
      lastBodyPartIndex =
        lastBodyPartIndex === bodyParts.length - 1 ? 0 : lastBodyPartIndex + 1;
    }
    function newBody(part: BodyPartConstant) {
      return [...body, part];
    }
    function tryToAddToBody(part?: BodyPartConstant) {
      if (body.length >= 50) return; // Should contain 1 to 50 elements
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
    const totalEnergy = HelpersFind.getRoomTotalEnergyForSpawningAvailable(
      room
    );
    const body: BodyPartConstant[] = [MOVE, WORK, CARRY];
    const bodyParts = [WORK, CARRY];
    let lastBodyPartIndex = 0;
    tryToAddToBody();
    if (HelpersCreep.bodyCost(body) <= totalEnergy) {
      return body;
    } else {
      return null;
    }
  }
}

export const TRANSFER_PATH = {stroke: '#ffffff'};
export const GET_ENERGY_PATH = {stroke: '#ffff00'}; /// yellow
export const CLAIM_PATH = {stroke: '#ff00ff'};
export const BUILD_PATH = {stroke: '#000aff'};
export const UPGRADE_PATH = {stroke: '#fff000'};

export const CLAIM_FLAG_NAME = 'ClaimMe';
export const BUILD_FLAG_NAME = 'BuildMe';
