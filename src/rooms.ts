import { Towers } from './towers';
import { Market } from './market';
import { filter } from 'lodash';
import { CreepRole } from './enums';

export class Rooms {
  constructor() {
    for (const roomCoordinates of Object.keys(Game.rooms)) {
      const room = Game.rooms[roomCoordinates];
      this._rooms.push(room);
    }
  }

  private _rooms: Room[] = [];

  get rooms(): Room[] {
    return this._rooms;
  }

  run() {
    this.rooms.forEach((room: Room) => {
      let maxHits;
      if (room.name === 'E48N17') {
        maxHits = 10000;
      }
      new Towers(room).run(maxHits);
      new Market(room).run();
    });
  }

  private spawnCreeps(room: Room) {
    function getCreepsByRole(role: CreepRole): Creep[] {
      return filter(
        Game.creeps,
        (creep: Creep) =>
          creep.memory.role === role && creep.memory.room === room.name
      );
    }

    const harvesters = getCreepsByRole(CreepRole.harvester);
    const builders = getCreepsByRole(CreepRole.builder);
    const upgraders = getCreepsByRole(CreepRole.upgrader);
    const extractors = getCreepsByRole(CreepRole.extractor);
    const energizers = getCreepsByRole(CreepRole.energizer);

    if (harvesters.length < 1) {
    }
  }
}
