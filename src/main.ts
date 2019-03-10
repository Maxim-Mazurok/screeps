import { Rooms } from './rooms';
import * as _ from 'lodash';

const roleHarvester = require('./harvester');
const roleUpgrader = require('./upgrader');
const roleBuilder = require('./builder');
const roleExtractor = require('./extractor');
const roleEnergizer = require('./energizer');

const roleUptownHarvester = require('./uptown.harvester');
const roleUptownClaimer = require('./uptown.claimer');

//const tower = require('tower');

declare global {
  // noinspection JSUnusedGlobalSymbols
  interface CreepMemory {
    role: string;
    roomN: string;

    [name: string]: string | number | boolean;
  }
}

module.exports.loop = () => {
  for (const name of Object.keys(Memory.creeps)) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      //console.log('Clearing non-existing creep memory:', name);
    }
  }

  const harvesters = _.filter(
    Game.creeps,
    (creep: Creep) =>
      creep.memory.role === 'harvester' && creep.memory.roomN === '1'
  );
  const harvestersE = _.filter(
    Game.creeps,
    (creep: Creep) =>
      creep.memory.role === 'harvester' &&
      creep.memory.roomN === '1' &&
      creep.memory.e === '1'
  );
  const builders = _.filter(
    Game.creeps,
    (creep: Creep) =>
      creep.memory.role === 'builder' && creep.memory.roomN === '1'
  );
  const upgraders = _.filter(
    Game.creeps,
    (creep: Creep) =>
      creep.memory.role === 'upgrader' && creep.memory.roomN === '1'
  );
  const extractors = _.filter(
    Game.creeps,
    (creep: Creep) =>
      creep.memory.role === 'extractor' && creep.memory.roomN === '1'
  );
  const energizers = _.filter(
    Game.creeps,
    (creep: Creep) =>
      creep.memory.role === 'energizer' && creep.memory.roomN === '1'
  );

  const harvesters2 = _.filter(
    Game.creeps,
    (creep: Creep) =>
      creep.memory.role === 'harvester' && creep.memory.roomN === '2'
  );
  const builders2 = _.filter(
    Game.creeps,
    (creep: Creep) =>
      creep.memory.role === 'builder' && creep.memory.roomN === '2'
  );
  const upgraders2 = _.filter(
    Game.creeps,
    (creep: Creep) =>
      creep.memory.role === 'upgrader' && creep.memory.roomN === '2'
  );

  const uptownHarvesters = _.filter(
    Game.creeps,
    (creep: Creep) => creep.memory.role === 'uptown-harvester'
  );
  const uptownClaimers = _.filter(
    Game.creeps,
    (creep: Creep) => creep.memory.role === 'uptown-claimer'
  );

  if (
    harvesters.length < 1 ||
    (harvestersE.length === 1 && harvesters.length < 2)
  ) {
    const newName = 'Harvester' + Game.time;
    if (harvestersE.length < 1) {
      if (
        Game.spawns['Spawn1'].spawnCreep(
          [
            MOVE,
            MOVE,
            MOVE,
            MOVE,
            MOVE,
            MOVE,
            MOVE,
            MOVE,
            MOVE,
            WORK,
            WORK,
            WORK,
            WORK,
            WORK,
            WORK,
            WORK,
            WORK,
            WORK,
            WORK,
            CARRY,
            CARRY,
            CARRY,
            CARRY,
            CARRY,
            CARRY,
            CARRY,
          ],
          newName,
          { memory: { role: 'harvester', roomN: '1' } }
        ) === ERR_NOT_ENOUGH_ENERGY
      ) {
        Game.spawns['Spawn1'].spawnCreep([MOVE, CARRY, WORK], newName, {
          memory: { role: 'harvester', roomN: '1', e: '1' },
        });
      }
    } else {
      Game.spawns['Spawn1'].spawnCreep(
        [
          MOVE,
          MOVE,
          MOVE,
          MOVE,
          MOVE,
          MOVE,
          MOVE,
          MOVE,
          MOVE,
          WORK,
          WORK,
          WORK,
          WORK,
          WORK,
          WORK,
          WORK,
          WORK,
          WORK,
          WORK,
          CARRY,
          CARRY,
          CARRY,
          CARRY,
          CARRY,
          CARRY,
          CARRY,
        ],
        newName,
        { memory: { role: 'harvester', roomN: '1' } }
      );
    }
  } else if (builders.length < 0) {
    const newName = 'Builder' + Game.time;
    //Game.spawns['Spawn1'].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], newName,
    Game.spawns['Spawn1'].spawnCreep(
      [
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        WORK,
        WORK,
        WORK,
        WORK,
        WORK,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
      ],
      newName,
      { memory: { role: 'builder', roomN: '1' } }
    );
  } else if (upgraders.length < 1) {
    const newName = 'Upgrader' + Game.time;
    //Game.spawns['Spawn1'].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], newName,
    Game.spawns['Spawn1'].spawnCreep(
      [
        MOVE,
        MOVE,
        MOVE,
        WORK,
        WORK,
        WORK,
        CARRY,
        WORK,
        CARRY,
        WORK,
        CARRY,
        WORK,
        CARRY,
        CARRY,
        CARRY,
      ],
      newName,
      { memory: { role: 'upgrader', roomN: '1' } }
    );
  } else if (uptownHarvesters.length < 0) {
    const newName = 'UptownHarvester' + Game.time;
    Game.spawns['Spawn1'].spawnCreep(
      [
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        WORK,
        WORK,
        WORK,
        WORK,
        WORK,
        WORK,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
      ],
      newName,
      { memory: { role: 'uptown-harvester', roomN: '1' } }
    );
  } else if (uptownClaimers.length < 0) {
    const newName = 'UptownClaimer' + Game.time;
    Game.spawns['Spawn1'].spawnCreep(
      [
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        CLAIM,
        CLAIM,
      ],
      newName,
      { memory: { role: 'uptown-claimer', roomN: '1' } }
    );
  } else if (
    extractors.length < 1 &&
    Game.rooms['E47N16'].lookForAt('mineral', 20, 21)[0].mineralAmount > 0
  ) {
    const newName = 'Extractor' + Game.time;
    Game.spawns['Spawn1'].spawnCreep(
      [MOVE, WORK, CARRY, WORK, CARRY, WORK, CARRY],
      newName,
      { memory: { role: 'extractor', roomN: '1' } }
    );
  } else if (energizers.length < 1) {
    const terminal = Game.rooms['E47N16'].terminal;
    const amountOfH = terminal!.store[RESOURCE_HYDROGEN] || 0;
    if (
      terminal &&
      terminal.store[RESOURCE_ENERGY] < 10000 &&
      amountOfH > 1000
    ) {
      const newName = 'Energizer' + Game.time;
      Game.spawns['Spawn1'].spawnCreep([MOVE, MOVE, CARRY, CARRY], newName, {
        memory: { role: 'energizer', roomN: '1' },
      });
    }
  }

  if (harvesters2.length < 1) {
    const newName = 'Harvester2' + Game.time;
    Game.spawns['Spawn2'].spawnCreep(
      [
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        WORK,
        WORK,
        WORK,
        WORK,
        CARRY,
        CARRY,
      ],
      newName,
      { memory: { role: 'harvester', roomN: '2' } }
    );
  } else if (upgraders2.length < 2) {
    const newName = 'Upgrader2' + Game.time;
    Game.spawns['Spawn2'].spawnCreep(
      [
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        WORK,
        WORK,
        WORK,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
      ],
      newName,
      { memory: { role: 'upgrader', roomN: '2' } }
    );
  } else if (builders2.length < 1) {
    const newName = 'Builder2' + Game.time;
    Game.spawns['Spawn2'].spawnCreep(
      [
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        WORK,
        WORK,
        WORK,
        CARRY,
        CARRY,
        CARRY,
      ],
      newName,
      { memory: { role: 'builder', roomN: '2' } }
    );
  }

  // if(Game.spawns['Spawn1'].spawning) {
  //     const spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
  //     Game.spawns['Spawn1'].room.visual.text(
  //         '🛠️' + spawningCreep.memory.role,
  //         Game.spawns['Spawn1'].pos.x + 1,
  //         Game.spawns['Spawn1'].pos.y,
  //         {align: 'left', opacity: 0.8});
  // }

  for (const name of Object.keys(Game.creeps)) {
    const creep = Game.creeps[name];
    if (harvesters.length < 1 && creep.memory.roomN === '1') {
      roleHarvester.run(creep);
    }
    if (harvesters2.length < 1 && creep.memory.roomN === '2') {
      roleHarvester.run(creep);
    }
    if (creep.memory.role === 'harvester') {
      roleHarvester.run(creep);
    }
    if (creep.memory.role === 'upgrader') {
      roleUpgrader.run(creep);
    }
    if (creep.memory.role === 'builder') {
      roleBuilder.run(creep);
      // try {
      //     roleUptownHarvester.run(creep);
      // } catch (e) {
      //     //console.log(e.message);
      // }
    }
    if (creep.memory.role === 'uptown-harvester') {
      roleUptownHarvester.run(creep);
    }
    if (creep.memory.role === 'uptown-claimer') {
      roleUptownClaimer.run(creep);
    }
    if (creep.memory.role === 'extractor') {
      roleExtractor.run(creep);
    }
    if (creep.memory.role === 'energizer') {
      roleEnergizer.run(creep);
    }
  }

  // tower.tower('E47N16');
  // tower.tower('E47N17');

  // tslint:disable-next-line
  const linkFrom: StructureLink | any = Game.rooms['E47N16'].lookForAt(
    'structure',
    9,
    31
  )[0];
  // tslint:disable-next-line
  const linkToBuild: StructureLink | any = Game.rooms['E47N16'].lookForAt(
    'structure',
    16,
    23
  )[0];
  // tslint:disable-next-line
  const linkToUpgrade: StructureLink | any = Game.rooms['E47N16'].lookForAt(
    'structure',
    43,
    10
  )[0];
  if (linkToUpgrade.energy < 150 + 600) {
    // tslint:disable-next-line
    linkFrom.transferEnergy(linkToUpgrade);
  } else {
    // tslint:disable-next-line
    linkFrom.transferEnergy(linkToBuild, Math.max(linkFrom.energy, 600));
  }

  // tslint:disable-next-line
  const linkFrom2: StructureLink | any = Game.rooms['E47N17'].lookForAt(
    'structure',
    40,
    12
  )[0];
  // tslint:disable-next-line
  const linkToBuild2: StructureLink | any = Game.rooms['E47N17'].lookForAt(
    'structure',
    11,
    36
  )[0];
  //const linkToUpgrade2 = Game.rooms['E47N17'].lookForAt('structure', 43, 10)[0];
  // if (linkToUpgrade.energy < 150 + 600) {
  //     linkFrom.transferEnergy(linkToUpgrade);
  // } else {
  // tslint:disable-next-line
  linkFrom2.transferEnergy(linkToBuild2, linkFrom2.energy);
  //}

  // try {
  //     const market = require('market');
  //     market.market();
  // } catch (e) {
  //     //console.log(e);
  // }

  new Rooms(Game).run();
};
