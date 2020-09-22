"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTeams = void 0;
const admin = require("firebase-admin");
const firestore = admin.firestore();
const teamsAPI = require("../api/teams.API");
const combinedStatsAPI = require("../api/CombinedStats.API");
const batchAPI = require("../api/batch.API");
const BatchModels_1 = require("../models/BatchModels");
const assignRosters = (players) => {
    const teams = {};
    players.forEach(player => {
        let team;
        if (Object.keys(teams).includes(player.PLAYERS.Team))
            team = teams[player.PLAYERS.Team];
        else {
            team = {};
            teams[player.PLAYERS.Team] = team;
            team.name = player.PLAYERS.Team;
            team.players = [];
        }
        if (!team.players)
            team.players = [];
        team.players.push(firestore.doc(`players/${player.PLAYERS.MLEID}`));
    });
    return teams;
};
async function updateTeams(players) {
    const [seasonStats, teamMeta, teamLeadership, rosters] = await Promise.all([
        combinedStatsAPI.getStats(),
        teamsAPI.getTeamMeta(),
        teamsAPI.getTeamLeadership(players),
        assignRosters(players)
    ]);
    const teams = {};
    const addToTeams = ([name, data]) => teams[name] = Object.assign((teams[name] || {}), data);
    Object.entries(seasonStats).forEach(addToTeams);
    Object.entries(teamMeta).forEach(addToTeams);
    Object.entries(teamLeadership).forEach(addToTeams);
    Object.entries(rosters).forEach(addToTeams);
    let docs = Object.values(teams);
    const collection = firestore.collection("teams");
    if (docs.some((t) => t.name === "#N/A")) {
        docs = docs.filter((t) => t.name !== "#N/A");
    }
    await batchAPI.writeBatches(new BatchModels_1.PrebatchData(collection, docs, (a) => a.name));
    console.log("Done updating teams...");
}
exports.updateTeams = updateTeams;
//# sourceMappingURL=teams.js.map