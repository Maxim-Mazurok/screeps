import { Rooms } from './rooms';
import * as _ from 'lodash';
import { Extractor } from './extractor';
import { RoleUptownClaimer } from './uptown.claimer';
import { RoleUptownBuilder } from './uptown.builder';
import { HelpersFind } from './helpers';

const roleHarvester = require('./harvester');
const roleUpgrader = require('./upgrader');
const roleBuilder = require('./builder');
const roleEnergizer = require('./energizer');

const roleUptownHarvester = require('./uptown.harvester');

//const tower = require('tower');

declare global {
  // noinspection JSUnusedGlobalSymbols
  interface CreepMemory {
    role: string;
    roomN: string;
    transferring?: boolean;

    [name: string]: string | number | boolean | undefined;
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
  const claimers2 = _.filter(
    Game.creeps,
    (creep: Creep) => creep.memory.role === 'claimer'
  );
  const uptownBuilders2 = _.filter(
    Game.creeps,
    (creep: Creep) => creep.memory.role === 'uptown-builder'
  );

  const upgraders3 = _.filter(
    Game.creeps,
    (creep: Creep) =>
      creep.memory.role === 'upgrader' && creep.memory.roomN === '3'
  );
  const builders3 = _.filter(
    Game.creeps,
    (creep: Creep) =>
      creep.memory.role === 'builder' && creep.memory.roomN === '3'
  );
  const harvesters3 = _.filter(
    Game.creeps,
    (creep: Creep) =>
      creep.memory.role === 'harvester' && creep.memory.roomN === '3'
  );

  /*const uptownHarvesters = _.filter(
    Game.creeps,
    (creep: Creep) => creep.memory.role === 'uptown-harvester'
  );
  */

  if (
    harvesters.length < 1 ||
    (harvestersE.length === 1 && harvesters.length < 2)
  ) {
    const newName = 'Harvester' + Game.time;
    if (harvestersE.length < 1) {
      if (
        Game.spawns['Spawn1'].spawnCreep(
          [
            ..._.fill(_.times(9), MOVE),
            ..._.fill(_.times(10), WORK),
            ..._.fill(_.times(7), CARRY),
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
          ..._.fill(_.times(9), MOVE),
          ..._.fill(_.times(10), WORK),
          ..._.fill(_.times(7), CARRY),
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
        ..._.fill(_.times(14), MOVE),
        ..._.fill(_.times(5), WORK),
        ..._.fill(_.times(12), CARRY),
      ],
      newName,
      { memory: { role: 'builder', roomN: '1' } }
    );
  } else if (upgraders.length < 1) {
    const newName = 'Upgrader' + Game.time;
    //Game.spawns['Spawn1'].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], newName,
    Game.spawns['Spawn1'].spawnCreep(
      [
        ..._.fill(_.times(10), MOVE),
        ..._.fill(_.times(10), WORK),
        ..._.fill(_.times(10), CARRY),
      ],
      newName,
      { memory: { role: 'upgrader', roomN: '1' } }
    );
  } /*else if (uptownHarvesters.length < 0) {
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
  }*/ else if (
    extractors.length < 1 &&
    Game.rooms['E47N16'].lookForAt('mineral', 20, 21)[0].mineralAmount > 0
  ) {
    const newName = 'Extractor' + Game.time;
    Game.spawns['Spawn1'].spawnCreep(
      [
        ..._.fill(_.times(1), MOVE),
        ..._.fill(_.times(20), WORK),
        ..._.fill(_.times(1), CARRY),
      ],
      newName,
      { memory: { role: 'extractor', roomN: '1' } }
    );
  } else if (energizers.length < 1) {
    const terminal = Game.rooms['E47N16'].terminal;
    const amountOfHInTerminal = terminal!.store[RESOURCE_HYDROGEN] || 0;
    const amountOfEnergyInStorage =
      Game.rooms['E47N16'].storage!.store.energy || 0;
    if (
      terminal &&
      terminal.store[RESOURCE_ENERGY] < 50000 &&
      amountOfHInTerminal > 1000 &&
      amountOfEnergyInStorage > 10000
    ) {
      const newName = 'Energizer' + Game.time;
      Game.spawns['Spawn1'].spawnCreep(
        [..._.fill(_.times(5), MOVE), ..._.fill(_.times(5), CARRY)],
        newName,
        {
          memory: { role: 'energizer', roomN: '1' },
        }
      );
    }
  }

  if (harvesters2.length < 1) {
    const newName = 'Harvester2' + Game.time;
    Game.spawns['Spawn2'].spawnCreep(
      [
        ..._.fill(_.times(9), MOVE),
        ..._.fill(_.times(10), WORK),
        ..._.fill(_.times(7), CARRY),
      ],
      newName,
      { memory: { role: 'harvester', roomN: '2' } }
    );
  } else if (upgraders2.length < 1) {
    const newName = 'Upgrader2' + Game.time;
    Game.spawns['Spawn2'].spawnCreep(
      [
        ..._.fill(_.times(8), MOVE),
        ..._.fill(_.times(8), WORK),
        ..._.fill(_.times(8), CARRY),
      ],
      newName,
      { memory: { role: 'upgrader', roomN: '2' } }
    );
  } else if (builders2.length < 0) {
    const newName = 'Builder2' + Game.time;
    Game.spawns['Spawn2'].spawnCreep(
      [
        ..._.fill(_.times(4), MOVE),
        ..._.fill(_.times(4), WORK),
        ..._.fill(_.times(4), CARRY),
      ],
      newName,
      { memory: { role: 'builder', roomN: '2' } }
    );
  } else if (claimers2.length < 0) {
    const newName = 'Claimer2' + Game.time;
    Game.spawns['Spawn2'].spawnCreep(
      [..._.fill(_.times(6), MOVE), ..._.fill(_.times(2), CLAIM)],
      newName,
      { memory: { role: 'claimer', roomN: '2' } }
    );
  } else if (uptownBuilders2.length < 0) {
    const newName = 'UptownBuilder2' + Game.time;
    Game.spawns['Spawn2'].spawnCreep(
      [
        ..._.fill(_.times(4), MOVE),
        ..._.fill(_.times(4), WORK),
        ..._.fill(_.times(4), CARRY),
        ..._.fill(_.times(1), CLAIM),
      ],
      newName,
      { memory: { role: 'uptown-builder', roomN: '2' } }
    );
  }

  if (harvesters3.length < 1) {
    const newName = 'Harvester3' + Game.time;
    if (
      HelpersFind.getRoomTotalEnergyForSpawningAvailable(new Room('E48N17')) <
      500
    ) {
      Game.spawns['Spawn3'].spawnCreep(
        [
          ..._.fill(_.times(1), MOVE),
          ..._.fill(_.times(1), WORK),
          ..._.fill(_.times(1), CARRY),
        ],
        newName,
        { memory: { role: 'harvester', roomN: '3' } }
      );
    } else {
      Game.spawns['Spawn3'].spawnCreep(
        [
          ..._.fill(_.times(4), MOVE),
          ..._.fill(_.times(2), WORK),
          ..._.fill(_.times(2), CARRY),
        ],
        newName,
        { memory: { role: 'harvester', roomN: '3' } }
      );
    }
  } else if (upgraders3.length < 1) {
    const newName = 'Upgrader3' + Game.time;
    Game.spawns['Spawn3'].spawnCreep(
      [
        ..._.fill(_.times(4), MOVE),
        ..._.fill(_.times(2), WORK),
        ..._.fill(_.times(2), CARRY),
      ],
      newName,
      { memory: { role: 'upgrader', roomN: '3' } }
    );
  } else if (builders3.length < 1) {
    if (
      HelpersFind.findSomethingToBuild(new Room('E48N17'), 250000, false)
        .length > 0
    ) {
      const newName = 'Builder3' + Game.time;
      Game.spawns['Spawn3'].spawnCreep(
        [
          ..._.fill(_.times(4), MOVE),
          ..._.fill(_.times(2), WORK),
          ..._.fill(_.times(2), CARRY),
        ],
        newName,
        { memory: { role: 'builder', roomN: '3' } }
      );
    }
  }

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
    if (creep.memory.role === 'claimer') {
      RoleUptownClaimer.run(creep);
    }
    if (creep.memory.role === 'uptown-builder') {
      RoleUptownBuilder.run(creep);
    }
    if (creep.memory.role === 'extractor') {
      new Extractor().run(creep);
    }
    if (creep.memory.role === 'energizer') {
      roleEnergizer.run(creep);
    }
  }

  // tslint:disable-next-line
  const linkFrom: StructureLink | any = Game.rooms['E47N16'].lookForAt(
    'structure',
    9,
    31
  )[0];
  // tslint:disable-next-line
  const linkToUpgrade: StructureLink | any = Game.rooms['E47N16'].lookForAt(
    'structure',
    43,
    10
  )[0];
  linkFrom.transferEnergy(linkToUpgrade);

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
