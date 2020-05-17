import * as _ from 'lodash';
import {Towers} from './towers';
import {Market} from './market';
import {filter} from 'lodash';
import {CreepRole} from './enums';

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
    // const builders = getCreepsByRole(CreepRole.builder);
    // const upgraders = getCreepsByRole(CreepRole.upgrader);
    // const extractors = getCreepsByRole(CreepRole.extractor);
    // const energizers = getCreepsByRole(CreepRole.energizer);

    if (config.claim) {
      const claimBuilders = getCreepsByRole(CreepRole.claimer);

      if (claimBuilders.length < 1) {
        config.claim.forEach(({to: claimRoomName}) => {
          const newName = `Claimer_${room.name}->${claimRoomName}_${Game.time}`;
          const spawn = room.find(FIND_MY_SPAWNS)[0];
          if (spawn) {
            spawn.spawnCreep(
              [
                ..._.fill(_.times(4), MOVE),
                ..._.fill(_.times(4), WORK),
                ..._.fill(_.times(4), CARRY),
                ..._.fill(_.times(1), CLAIM),
              ],
              newName,
              {memory: {role: CreepRole.claimer, room: room.name}}
            );
          }
        });
      }
    }
  }
}
