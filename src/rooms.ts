import {Towers} from './towers';
import {Market} from './market';
import {filter} from 'lodash';
import {CreepRole} from './enums';
import {HelpersFind, HelpersCreep} from './helpers';
import {RoomsConfig, RoomConfig} from './ts';

export class Rooms {
  constructor(roomsConfig: RoomsConfig) {
    this.roomsConfig = roomsConfig;
    for (const roomCoordinates of Object.keys(Game.rooms)) {
      const room = Game.rooms[roomCoordinates];
      this.rooms.push(room);
    }
  }

  private rooms: Room[] = [];
  private roomsConfig: RoomsConfig;

  run() {
    this.rooms.forEach((room: Room) => {
      const config = this.roomsConfig.find(x => x.roomName === room.name);

      new Towers(room).run();
      new Market(room).run();
      config && this.spawnCreeps(room, config);
    });
  }

  private spawnCreeps(room: Room, config: RoomConfig) {
    function getCreepsByRole(role: CreepRole): Creep[] {
      return filter(
        Game.creeps,
        (creep: Creep) =>
          creep.memory.role === role && creep.memory.room === room.name
      );
    }

    // const harvesters = getCreepsByRole(CreepRole.harvester);
    // const upgraders = getCreepsByRole(CreepRole.upgrader);
    // const extractors = getCreepsByRole(CreepRole.extractor);
    // const energizers = getCreepsByRole(CreepRole.energizer);

    const spawn = room.find(FIND_MY_SPAWNS)[0];
    if (!spawn) return;

    if (config.claim && config.skills && config.skills[CreepRole.claimer]) {
      const claimers = getCreepsByRole(CreepRole.claimer);

      if (!claimers.length) {
        const claimerSkills = config.skills[CreepRole.claimer];
        config.claim.forEach(({to: claimRoomName}) => {
          const newName = `Claimer_${room.name}->${claimRoomName}_${Game.time}`;
          claimerSkills &&
            spawn.spawnCreep(claimerSkills, newName, {
              memory: {role: CreepRole.claimer, room: room.name},
            });
        });
      }
    }

    if (
      HelpersFind.findSomethingToBuild(room) &&
      config.skills &&
      config.skills[CreepRole.builder]
    ) {
      const builders = getCreepsByRole(CreepRole.builder);
      if (!builders.length) {
        const builderSkills = config.skills[CreepRole.builder];

        const newName = `Builder_${room.name}_${Game.time}`;
        builderSkills &&
          spawn.spawnCreep(builderSkills, newName, {
            memory: {role: CreepRole.builder, room: room.name},
          });
      }
    }

    if (
      config.autoSpawn &&
      config.autoSpawn.enabled &&
      HelpersFind.findAllMyCreepsInRoom(room).length <
        config.autoSpawn.maxCreeps
    ) {
      const totalEnergy = HelpersFind.getRoomTotalEnergyForSpawningAvailable(
        room
      );
      const body: BodyPartConstant[] = [];
      const bodyParts = [MOVE, WORK, CARRY];
      let lastBodyPartIndex = bodyParts.length - 1;
      while (HelpersCreep.bodyCost(body) < totalEnergy) {
        lastBodyPartIndex =
          lastBodyPartIndex === bodyParts.length - 1
            ? 0
            : lastBodyPartIndex + 1;
        if (
          HelpersCreep.bodyCost([...body, bodyParts[lastBodyPartIndex]]) <=
          totalEnergy
        ) {
          body.push(bodyParts[lastBodyPartIndex]);
        } else {
          break;
        }
      }
      spawn.spawnCreep(body, Math.random().toString());
    }
  }
}
