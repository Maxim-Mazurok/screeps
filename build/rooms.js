Object.defineProperty(exports, '__esModule', {value: true});
exports.Rooms = void 0;
const _ = require('lodash');
const towers_1 = require('./towers');
const market_1 = require('./market');
const lodash_1 = require('lodash');
const enums_1 = require('./enums');
class Rooms {
  constructor(roomsConfig) {
    this.rooms = [];
    this.roomsConfig = roomsConfig;
    for (const roomCoordinates of Object.keys(Game.rooms)) {
      const room = Game.rooms[roomCoordinates];
      this.rooms.push(room);
    }
  }
  run() {
    this.rooms.forEach(room => {
      const config = this.roomsConfig.find(x => x.roomName === room.name);
      new towers_1.Towers(room).run();
      new market_1.Market(room).run();
      config && this.spawnCreeps(room, config);
    });
  }
  spawnCreeps(room, config) {
    function getCreepsByRole(role) {
      return lodash_1.filter(
        Game.creeps,
        creep => creep.memory.role === role && creep.memory.room === room.name
      );
    }
    // const harvesters = getCreepsByRole(CreepRole.harvester);
    // const builders = getCreepsByRole(CreepRole.builder);
    // const upgraders = getCreepsByRole(CreepRole.upgrader);
    // const extractors = getCreepsByRole(CreepRole.extractor);
    // const energizers = getCreepsByRole(CreepRole.energizer);
    if (config.claim) {
      const claimers = getCreepsByRole(enums_1.CreepRole.claimer);
      if (claimers.length < 1) {
        config.claim.forEach(({to: claimRoomName}) => {
          const newName = `Claimer_${room.name}->${claimRoomName}_${Game.time}`;
          const spawn = room.find(FIND_MY_SPAWNS)[0];
          if (spawn) {
            spawn.spawnCreep(
              [..._.fill(_.times(6), MOVE), ..._.fill(_.times(2), CLAIM)],
              newName,
              {memory: {role: enums_1.CreepRole.claimer, room: room.name}}
            );
          }
        });
      }
    }
  }
}
exports.Rooms = Rooms;
//# sourceMappingURL=rooms.js.map
