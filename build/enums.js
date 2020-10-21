Object.defineProperty(exports, "__esModule", { value: true });
exports.CreepActivity = exports.EnergySource = exports.CreepRole = void 0;
var CreepRole;
(function (CreepRole) {
    CreepRole[CreepRole["harvester"] = 0] = "harvester";
    CreepRole[CreepRole["builder"] = 1] = "builder";
    CreepRole[CreepRole["upgrader"] = 2] = "upgrader";
    CreepRole[CreepRole["extractor"] = 3] = "extractor";
    CreepRole[CreepRole["energizer"] = 4] = "energizer";
    CreepRole[CreepRole["uptownHarvester"] = 5] = "uptownHarvester";
    CreepRole[CreepRole["claimer"] = 6] = "claimer";
})(CreepRole = exports.CreepRole || (exports.CreepRole = {}));
var EnergySource;
(function (EnergySource) {
    EnergySource[EnergySource["link"] = 0] = "link";
    EnergySource[EnergySource["storage"] = 1] = "storage";
    EnergySource[EnergySource["tombstone"] = 2] = "tombstone";
    EnergySource[EnergySource["dropped"] = 3] = "dropped";
    EnergySource[EnergySource["mine"] = 4] = "mine";
    EnergySource[EnergySource["ruin"] = 5] = "ruin";
})(EnergySource = exports.EnergySource || (exports.EnergySource = {}));
var CreepActivity;
(function (CreepActivity) {
    CreepActivity[CreepActivity["replenishSpawnEnergy"] = 0] = "replenishSpawnEnergy";
    CreepActivity[CreepActivity["replenishExtensionEnergy"] = 1] = "replenishExtensionEnergy";
    CreepActivity[CreepActivity["build"] = 2] = "build";
    CreepActivity[CreepActivity["replenishTowerEnergy"] = 3] = "replenishTowerEnergy";
    CreepActivity[CreepActivity["replenishLinkEnergy"] = 4] = "replenishLinkEnergy";
    CreepActivity[CreepActivity["replenishStorageEnergy"] = 5] = "replenishStorageEnergy";
})(CreepActivity = exports.CreepActivity || (exports.CreepActivity = {}));
