var roleUptownClaimer = {
    /** @param {Creep} creep **/
    run: function (creep) {
        creep.claimController(creep.room.controller);
        if ([ERR_NOT_IN_RANGE, ERR_INVALID_TARGET].indexOf(creep.claimController(Game.flags['ClaimMe'])) !== -1) {
            creep.moveTo(Game.flags['ClaimMe'], { visualizePathStyle: { stroke: '#ffff00' } });
        }
    }
};
module.exports = roleUptownClaimer;
//# sourceMappingURL=uptown.claimer.js.map