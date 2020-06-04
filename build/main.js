Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const rooms_1 = require("./rooms");
const extractor_1 = require("./extractor");
const claimer_1 = require("./claimer");
const helpers_find_1 = require("./helpers.find");
const helpers_creep_1 = require("./helpers.creep");
const enums_1 = require("./enums");
const generalCreep_1 = require("./generalCreep");
const harvester = require('./harvester');
const roleBuilder = require('./builder');
const roleEnergizer = require('./energizer');
const roleUptownHarvester = require('./uptown.harvester');
const roomsConfig = [
    {
        roomName: 'E48N18',
        autoSpawn: {
            enabled: true,
            maxCreeps: 3,
        },
        build: {
            maxHits: 100000,
            maxWallHits: 100000,
        },
    },
    {
        roomName: 'E48N17',
        // claim: [
        //   {
        //     to: 'E48N18',
        //   },
        // ],
        skills: {
            [enums_1.CreepRole.claimer]: [
                ..._.fill(_.times(4), MOVE),
                ..._.fill(_.times(4), WORK),
                ..._.fill(_.times(4), CARRY),
                ..._.fill(_.times(1), CLAIM),
            ],
        },
        build: {
            maxHits: 1000000,
            maxWallHits: 1000000,
        },
    },
    {
        roomName: 'E47N17',
        skills: {
            [enums_1.CreepRole.builder]: [
                ..._.fill(_.times(12), MOVE),
                ..._.fill(_.times(6), WORK),
                ..._.fill(_.times(6), CARRY),
            ],
        },
        build: {
            maxHits: 2000000,
            maxWallHits: 500000,
        },
    },
];
function loop() {
    helpers_creep_1.HelpersCreep.clearNonExistingCreepsMemory();
    const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === enums_1.CreepRole.harvester && creep.memory.room === '1');
    const harvestersE = _.filter(Game.creeps, (creep) => creep.memory.role === enums_1.CreepRole.harvester &&
        creep.memory.room === '1' &&
        creep.memory.e === '1');
    const builders = _.filter(Game.creeps, (creep) => creep.memory.role === enums_1.CreepRole.builder && creep.memory.room === '1');
    const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === enums_1.CreepRole.upgrader && creep.memory.room === '1');
    const extractors = _.filter(Game.creeps, (creep) => creep.memory.role === enums_1.CreepRole.extractor && creep.memory.room === '1');
    const energizers = _.filter(Game.creeps, (creep) => creep.memory.role === enums_1.CreepRole.energizer && creep.memory.room === '1');
    const harvesters2 = _.filter(Game.creeps, (creep) => creep.memory.role === enums_1.CreepRole.harvester && creep.memory.room === '2');
    const builders2 = _.filter(Game.creeps, (creep) => creep.memory.role === enums_1.CreepRole.builder && creep.memory.room === '2');
    const upgraders2 = _.filter(Game.creeps, (creep) => creep.memory.role === enums_1.CreepRole.upgrader && creep.memory.room === '2');
    const claimers2 = _.filter(Game.creeps, (creep) => creep.memory.role === enums_1.CreepRole.claimer);
    const uptownBuilders2 = _.filter(Game.creeps, (creep) => creep.memory.role === enums_1.CreepRole.claimer);
    const extractors2 = _.filter(Game.creeps, (creep) => creep.memory.role === enums_1.CreepRole.extractor && creep.memory.room === '2');
    const energizers2 = _.filter(Game.creeps, (creep) => creep.memory.role === enums_1.CreepRole.energizer && creep.memory.room === '2');
    const upgraders3 = _.filter(Game.creeps, (creep) => creep.memory.role === enums_1.CreepRole.upgrader && creep.memory.room === '3');
    const builders3 = _.filter(Game.creeps, (creep) => creep.memory.role === enums_1.CreepRole.builder && creep.memory.room === '3');
    const harvesters3 = _.filter(Game.creeps, (creep) => creep.memory.role === enums_1.CreepRole.harvester && creep.memory.room === '3');
    if (harvesters.length < 1 ||
        (harvestersE.length === 1 && harvesters.length < 2)) {
        const newName = 'Harvester' + Game.time;
        if (harvestersE.length < 1) {
            if (Game.spawns['Spawn1'].spawnCreep([
                ..._.fill(_.times(9), MOVE),
                ..._.fill(_.times(10), WORK),
                ..._.fill(_.times(7), CARRY),
            ], newName, { memory: { role: enums_1.CreepRole.harvester, room: '1' } }) === ERR_NOT_ENOUGH_ENERGY) {
                Game.spawns['Spawn1'].spawnCreep([MOVE, CARRY, WORK], newName, {
                    memory: { role: enums_1.CreepRole.harvester, room: '1', e: '1' },
                });
            }
        }
        else {
            Game.spawns['Spawn1'].spawnCreep([
                ..._.fill(_.times(9), MOVE),
                ..._.fill(_.times(10), WORK),
                ..._.fill(_.times(7), CARRY),
            ], newName, { memory: { role: enums_1.CreepRole.harvester, room: '1' } });
        }
    }
    else if (builders.length < 0) {
        const newName = 'Builder' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([
            ..._.fill(_.times(14), MOVE),
            ..._.fill(_.times(5), WORK),
            ..._.fill(_.times(12), CARRY),
        ], newName, { memory: { role: enums_1.CreepRole.builder, room: '1' } });
    }
    else if (upgraders.length < 1 &&
        (Game.rooms['E47N16'].storage.store.energy > 20000 ||
            Game.rooms['E47N16'].terminal.store[RESOURCE_HYDROGEN] === 0)) {
        const newName = 'Upgrader' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([
            ..._.fill(_.times(10), MOVE),
            ..._.fill(_.times(10), WORK),
            ..._.fill(_.times(10), CARRY),
        ], newName, { memory: { role: enums_1.CreepRole.upgrader, room: '1' } });
    }
    else if (extractors.length < 1 &&
        Game.rooms['E47N16'].lookForAt('mineral', 20, 21)[0].mineralAmount > 0 &&
        helpers_find_1.HelpersFind.getRoomTerminalFreeStorageAmount(Game.rooms['E47N16']) > 5000) {
        const newName = 'Extractor' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([
            ..._.fill(_.times(1), MOVE),
            ..._.fill(_.times(20), WORK),
            ..._.fill(_.times(1), CARRY),
        ], newName, { memory: { role: enums_1.CreepRole.extractor, room: '1' } });
    }
    else if (energizers.length < 1) {
        const terminal = Game.rooms['E47N16'].terminal;
        const amountOfHInTerminal = terminal.store[RESOURCE_HYDROGEN] || 0;
        const amountOfEnergyInStorage = Game.rooms['E47N16'].storage.store.energy || 0;
        if (terminal &&
            terminal.store[RESOURCE_ENERGY] < 50000 &&
            amountOfHInTerminal > 1000 &&
            amountOfEnergyInStorage > 10000) {
            const newName = 'Energizer' + Game.time;
            Game.spawns['Spawn1'].spawnCreep([..._.fill(_.times(5), MOVE), ..._.fill(_.times(5), CARRY)], newName, {
                memory: { role: enums_1.CreepRole.energizer, room: '1' },
            });
        }
    }
    if (harvesters2.length < 1) {
        const newName = 'Harvester2' + Game.time;
        Game.spawns['Spawn2'].spawnCreep([
            ..._.fill(_.times(9), MOVE),
            ..._.fill(_.times(10), WORK),
            ..._.fill(_.times(7), CARRY),
        ], newName, { memory: { role: enums_1.CreepRole.harvester, room: '2' } });
    }
    else if (upgraders2.length < 1) {
        const newName = 'Upgrader2' + Game.time;
        Game.spawns['Spawn2'].spawnCreep([
            ..._.fill(_.times(8), MOVE),
            ..._.fill(_.times(8), WORK),
            ..._.fill(_.times(8), CARRY),
        ], newName, { memory: { role: enums_1.CreepRole.upgrader, room: '2' } });
    }
    else if (builders2.length < 0) {
        const newName = 'Builder2' + Game.time;
        Game.spawns['Spawn2'].spawnCreep([
            ..._.fill(_.times(4), MOVE),
            ..._.fill(_.times(4), WORK),
            ..._.fill(_.times(4), CARRY),
        ], newName, { memory: { role: enums_1.CreepRole.builder, room: '2' } });
    }
    else if (claimers2.length < 0) {
        const newName = 'Claimer2' + Game.time;
        Game.spawns['Spawn2'].spawnCreep([..._.fill(_.times(6), MOVE), ..._.fill(_.times(2), CLAIM)], newName, { memory: { role: enums_1.CreepRole.claimer, room: '2' } });
    }
    else if (uptownBuilders2.length < 0) {
        const newName = 'UptownBuilder2' + Game.time;
        Game.spawns['Spawn2'].spawnCreep([
            ..._.fill(_.times(4), MOVE),
            ..._.fill(_.times(4), WORK),
            ..._.fill(_.times(4), CARRY),
            ..._.fill(_.times(1), CLAIM),
        ], newName, { memory: { role: enums_1.CreepRole.claimer, room: '2' } });
    }
    else if (extractors2.length < 1 &&
        Game.rooms['E47N17'].lookForAt('mineral', 42, 31)[0].mineralAmount > 0 &&
        helpers_find_1.HelpersFind.getRoomTerminalFreeStorageAmount(Game.rooms['E47N17']) > 5000) {
        const newName = 'Extractor' + Game.time;
        Game.spawns['Spawn2'].spawnCreep([
            ..._.fill(_.times(5), MOVE),
            ..._.fill(_.times(20), WORK),
            ..._.fill(_.times(1), CARRY),
        ], newName, { memory: { role: enums_1.CreepRole.extractor, room: '2' } });
    }
    else if (energizers2.length < 1) {
        const terminal = Game.rooms['E47N17'].terminal;
        const amountOfKInTerminal = terminal.store[RESOURCE_KEANIUM] || 0;
        const amountOfEnergyInStorage = Game.rooms['E47N17'].storage.store.energy || 0;
        if (terminal &&
            terminal.store[RESOURCE_ENERGY] < 50000 &&
            amountOfKInTerminal > 1000 &&
            amountOfEnergyInStorage > 10000) {
            const newName = 'Energizer' + Game.time;
            Game.spawns['Spawn2'].spawnCreep([..._.fill(_.times(5), MOVE), ..._.fill(_.times(5), CARRY)], newName, {
                memory: { role: enums_1.CreepRole.energizer, room: '2' },
            });
        }
    }
    const roomTotalEnergyForSpawningAvailable3 = helpers_find_1.HelpersFind.getRoomTotalEnergyForSpawningAvailable(new Room('E48N17'));
    if (harvesters3.length < 1) {
        const newName = 'Harvester3' + Game.time;
        if (roomTotalEnergyForSpawningAvailable3 >= 1500) {
            Game.spawns['Spawn3'].spawnCreep([
                ..._.fill(_.times(12), MOVE),
                ..._.fill(_.times(6), WORK),
                ..._.fill(_.times(6), CARRY),
            ], newName, { memory: { role: enums_1.CreepRole.harvester, room: '3' } });
        }
        else if (roomTotalEnergyForSpawningAvailable3 >= 800) {
            Game.spawns['Spawn3'].spawnCreep([
                ..._.fill(_.times(4), MOVE),
                ..._.fill(_.times(4), WORK),
                ..._.fill(_.times(4), CARRY),
            ], newName, { memory: { role: enums_1.CreepRole.harvester, room: '3' } });
        }
        else if (roomTotalEnergyForSpawningAvailable3 >= 400) {
            Game.spawns['Spawn3'].spawnCreep([
                ..._.fill(_.times(2), MOVE),
                ..._.fill(_.times(2), WORK),
                ..._.fill(_.times(2), CARRY),
            ], newName, { memory: { role: enums_1.CreepRole.harvester, room: '3' } });
        }
        else {
            Game.spawns['Spawn3'].spawnCreep([
                ..._.fill(_.times(1), MOVE),
                ..._.fill(_.times(1), WORK),
                ..._.fill(_.times(1), CARRY),
            ], newName, { memory: { role: enums_1.CreepRole.harvester, room: '3' } });
        }
    }
    else if (upgraders3.length < 1) {
        const newName = 'Upgrader3' + Game.time;
        if (roomTotalEnergyForSpawningAvailable3 >= 1500) {
            Game.spawns['Spawn3'].spawnCreep([
                ..._.fill(_.times(12), MOVE),
                ..._.fill(_.times(6), WORK),
                ..._.fill(_.times(6), CARRY),
            ], newName, { memory: { role: enums_1.CreepRole.upgrader, room: '3' } });
        }
        else if (roomTotalEnergyForSpawningAvailable3 >= 800) {
            Game.spawns['Spawn3'].spawnCreep([
                ..._.fill(_.times(2), MOVE),
                ..._.fill(_.times(2), WORK),
                ..._.fill(_.times(2), CARRY),
            ], newName, { memory: { role: enums_1.CreepRole.upgrader, room: '3' } });
        }
        else {
            Game.spawns['Spawn3'].spawnCreep([
                ..._.fill(_.times(1), MOVE),
                ..._.fill(_.times(1), WORK),
                ..._.fill(_.times(1), CARRY),
            ], newName, { memory: { role: enums_1.CreepRole.upgrader, room: '3' } });
        }
    }
    else if (builders3.length < 1) {
        if (helpers_find_1.HelpersFind.findSomethingToBuild(new Room('E48N17'), {
            maxHits: 250000,
            maxWallHits: 25000,
        }).length) {
            const newName = 'Builder3' + Game.time;
            if (roomTotalEnergyForSpawningAvailable3 >= 1500) {
                Game.spawns['Spawn3'].spawnCreep([
                    ..._.fill(_.times(12), MOVE),
                    ..._.fill(_.times(6), WORK),
                    ..._.fill(_.times(6), CARRY),
                ], newName, { memory: { role: enums_1.CreepRole.builder, room: '3' } });
            }
            else if (roomTotalEnergyForSpawningAvailable3 >= 800) {
                Game.spawns['Spawn3'].spawnCreep([
                    ..._.fill(_.times(2), MOVE),
                    ..._.fill(_.times(2), WORK),
                    ..._.fill(_.times(2), CARRY),
                ], newName, { memory: { role: enums_1.CreepRole.builder, room: '3' } });
            }
            else {
                Game.spawns['Spawn3'].spawnCreep([
                    ..._.fill(_.times(1), MOVE),
                    ..._.fill(_.times(1), WORK),
                    ..._.fill(_.times(1), CARRY),
                ], newName, { memory: { role: enums_1.CreepRole.builder, room: '3' } });
            }
        }
    }
    for (const name of Object.keys(Game.creeps)) {
        const creep = Game.creeps[name];
        if (harvesters.length < 1 && creep.memory.room === '1') {
            harvester.run(creep);
        }
        else if (harvesters2.length < 1 && creep.memory.room === '2') {
            harvester.run(creep);
        }
        else if (creep.memory.role === enums_1.CreepRole.harvester) {
            harvester.run(creep);
        }
        else if (creep.memory.role === enums_1.CreepRole.upgrader) {
            generalCreep_1.GeneralCreep.run(creep, {
                sources: [
                    enums_1.EnergySource.link,
                    enums_1.EnergySource.storage,
                    enums_1.EnergySource.dropped,
                    enums_1.EnergySource.tombstone,
                ],
            });
        }
        else if (creep.memory.role === enums_1.CreepRole.builder) {
            roleBuilder.run(creep);
            // try {
            //     roleUptownHarvester.run(creep);
            // } catch (e) {
            //     //console.log(e.message);
            // }
        }
        else if (creep.memory.role === enums_1.CreepRole.uptownHarvester) {
            roleUptownHarvester.run(creep);
        }
        else if (creep.memory.role === enums_1.CreepRole.claimer) {
            claimer_1.ClaimBuilder.run(creep);
        }
        else if (creep.memory.role === enums_1.CreepRole.extractor) {
            extractor_1.Extractor.run(creep);
        }
        else if (creep.memory.role === enums_1.CreepRole.energizer) {
            roleEnergizer.run(creep);
        }
        else {
            generalCreep_1.GeneralCreep.run(creep);
        }
    }
    const linkFrom = Game.rooms['E47N16'].lookForAt('structure', 9, 31)[0];
    const linkToUpgrade = Game.rooms['E47N16'].lookForAt('structure', 43, 10)[0];
    linkFrom.transferEnergy(linkToUpgrade);
    const linkFrom2 = Game.rooms['E47N17'].lookForAt('structure', 40, 12)[0];
    const linkToBuild2 = Game.rooms['E47N17'].lookForAt('structure', 11, 36)[0];
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
    new rooms_1.Rooms(roomsConfig).run();
}
module.exports.loop = () => {
    try {
        loop();
    }
    catch (e) {
        console.log('An error occurred!');
        console.log(e.message);
        console.log(e.stack);
    }
};
