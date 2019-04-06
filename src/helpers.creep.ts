import { sum } from 'lodash';

export class HelpersCreep {
  static totalCarry(creep: Creep): number {
    return sum(Object.values(creep.carry));
  }

  static logAction(creep: Creep, action = 'unknown action') {
    console.log(`${creep.name} || ${action}`);
    creep.say(action);
  }

  /**
   * @deprecated
   */
  static logErrorDeprecated(
    creep: Creep,
    errorTemplateString: (...args: string[]) => string,
    ...args: string[]
  ) {
    console.log(
      errorTemplateString.apply([creep.name, creep.room.name, ...args])
    );
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
}

export const TRANSFER_PATH = { visualizePathStyle: { stroke: '#ffffff' } };
export const HARVEST_PATH = { visualizePathStyle: { stroke: '#00ff00' } };
export const CLAIM_PATH = { visualizePathStyle: { stroke: '#ff00ff' } };
export const BUILD_PATH = { visualizePathStyle: { stroke: '#000aff' } };

export const CLAIM_FLAG_NAME = 'ClaimMe';
export const BUILD_FLAG_NAME = 'BuildMe';
