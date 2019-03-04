Object.defineProperty(exports, "__esModule", { value: true });
var roleHarvester = require('harvester');
var roleUpgrader = require('upgrader');
var roleBuilder = require('builder');
var roleExtractor = require('extractor');
var roleEnergizer = require('energizer');
var roleUptownHarvester = require('uptown.harvester');
var roleUptownClaimer = require('uptown.claimer');
const rooms_1 = require("./rooms");
const _ = require("lodash");
module.exports.loop = function () {
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.memory.roomN == '1');
    var harvestersE = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.memory.roomN == '1' && creep.memory.e == '1');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder' && creep.memory.roomN == '1');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader' && creep.memory.roomN == '1');
    var extractors = _.filter(Game.creeps, (creep) => creep.memory.role == 'extractor' && creep.memory.roomN == '1');
    var energizers = _.filter(Game.creeps, (creep) => creep.memory.role == 'energizer' && creep.memory.roomN == '1');
    var harvesters2 = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.memory.roomN == '2');
    var builders2 = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder' && creep.memory.roomN == '2');
    var upgraders2 = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader' && creep.memory.roomN == '2');
    var uptownHarvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'uptown-harvester');
    var uptownClaimers = _.filter(Game.creeps, (creep) => creep.memory.role == 'uptown-claimer');
    if (harvesters.length < 1 || harvestersE.length === 1 && harvesters.length < 2) {
        var newName = 'Harvester' + Game.time;
        if (harvestersE.length < 1) {
            if (Game.spawns['Spawn1'].spawnCreep([MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY], newName, { memory: { role: 'harvester', roomN: '1' } }) === ERR_NOT_ENOUGH_ENERGY) {
                Game.spawns['Spawn1'].spawnCreep([MOVE, CARRY, WORK], newName, { memory: { role: 'harvester', roomN: '1', e: '1' } });
            }
            ;
        }
        else {
            Game.spawns['Spawn1'].spawnCreep([MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY], newName, { memory: { role: 'harvester', roomN: '1' } });
        }
    }
    else if (builders.length < 0) {
        var newName = 'Builder' + Game.time;
        //Game.spawns['Spawn1'].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], newName, 
        Game.spawns['Spawn1'].spawnCreep([MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY], newName, { memory: { role: 'builder', roomN: '1' } });
    }
    else if (upgraders.length < 1) {
        var newName = 'Upgrader' + Game.time;
        //Game.spawns['Spawn1'].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], newName,
        Game.spawns['Spawn1'].spawnCreep([MOVE, MOVE, MOVE, WORK, WORK, WORK, CARRY, WORK, CARRY, WORK, CARRY, WORK, CARRY, CARRY, CARRY], newName, { memory: { role: 'upgrader', roomN: '1' } });
    }
    else if (uptownHarvesters.length < 0) {
        var newName = 'UptownHarvester' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY], newName, { memory: { role: 'uptown-harvester', roomN: '1' } });
    }
    else if (uptownClaimers.length < 0) {
        var newName = 'UptownClaimer' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CLAIM, CLAIM], newName, { memory: { role: 'uptown-claimer', roomN: '1' } });
    }
    else if (extractors.length < 1) {
        if (Game.rooms['E47N16'].lookForAt('mineral', 20, 21)[0].mineralAmount > 0) {
            var newName = 'Extractor' + Game.time;
            Game.spawns['Spawn1'].spawnCreep([MOVE, WORK, CARRY, WORK, CARRY, WORK, CARRY], newName, { memory: { role: 'extractor', roomN: '1' } });
        }
    }
    else if (energizers.length < 1) {
        let terminal = Game.rooms['E47N16'].terminal;
        let amountOfH = terminal.store[RESOURCE_HYDROGEN] || 0;
        if (terminal && terminal.store.energy < 10000 && amountOfH > 1000) {
            var newName = 'Energizer' + Game.time;
            Game.spawns['Spawn1'].spawnCreep([MOVE, MOVE, CARRY, CARRY], newName, { memory: { role: 'energizer', roomN: '1' } });
        }
    }
    if (harvesters2.length < 1) {
        var newName = 'Harvester2' + Game.time;
        Game.spawns['Spawn2'].spawnCreep([MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY, CARRY], newName, { memory: { role: 'harvester', roomN: '2' } });
    }
    else if (upgraders2.length < 2) {
        var newName = 'Upgrader2' + Game.time;
        Game.spawns['Spawn2'].spawnCreep([MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY], newName, { memory: { role: 'upgrader', roomN: '2' } });
    }
    else if (builders2.length < 1) {
        var newName = 'Builder2' + Game.time;
        Game.spawns['Spawn2'].spawnCreep([MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, CARRY, CARRY, CARRY], newName, { memory: { role: 'builder', roomN: '2' } });
    }
    // if(Game.spawns['Spawn1'].spawning) { 
    //     var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
    //     Game.spawns['Spawn1'].room.visual.text(
    //         '🛠️' + spawningCreep.memory.role,
    //         Game.spawns['Spawn1'].pos.x + 1, 
    //         Game.spawns['Spawn1'].pos.y, 
    //         {align: 'left', opacity: 0.8});
    // }
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (harvesters.length < 1 && creep.memory.roomN == '1')
            roleHarvester.run(creep);
        if (harvesters2.length < 1 && creep.memory.roomN == '2')
            roleHarvester.run(creep);
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
            // try {
            //     roleUptownHarvester.run(creep);
            // } catch (e) {
            //     console.log(e.message);
            // }
        }
        if (creep.memory.role == 'uptown-harvester') {
            roleUptownHarvester.run(creep);
        }
        if (creep.memory.role == 'uptown-claimer') {
            roleUptownClaimer.run(creep);
        }
        if (creep.memory.role == 'extractor') {
            roleExtractor.run(creep);
        }
        if (creep.memory.role == 'energizer') {
            roleEnergizer.run(creep);
        }
    }
    // tower.tower('E47N16');
    // tower.tower('E47N17');
    var linkFrom = Game.rooms['E47N16'].lookForAt('structure', 9, 31)[0];
    var linkToBuild = Game.rooms['E47N16'].lookForAt('structure', 16, 23)[0];
    var linkToUpgrade = Game.rooms['E47N16'].lookForAt('structure', 43, 10)[0];
    if (linkToUpgrade.energy < 150 + 600) {
        // tslint:disable-next-line
        linkFrom.transferEnergy(linkToUpgrade);
    }
    else {
        // tslint:disable-next-line
        linkFrom.transferEnergy(linkToBuild, Math.max(linkFrom.energy, 600));
    }
    var linkFrom2 = Game.rooms['E47N17'].lookForAt('structure', 40, 12)[0];
    var linkToBuild2 = Game.rooms['E47N17'].lookForAt('structure', 11, 36)[0];
    //var linkToUpgrade2 = Game.rooms['E47N17'].lookForAt('structure', 43, 10)[0];
    // if (linkToUpgrade.energy < 150 + 600) {
    //     linkFrom.transferEnergy(linkToUpgrade);
    // } else {
    // tslint:disable-next-line
    linkFrom2.transferEnergy(linkToBuild2, linkFrom2.energy);
    //}
    // try {
    //     var market = require('market');
    //     market.market();
    // } catch (e) {
    //     console.log(e);
    // }
    const rooms = new rooms_1.default(Game);
    rooms.run();
};
//# sourceMappingURL=main.js.map