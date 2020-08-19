const sheets = require('../sheets');
const util = require("../util");
const batchAPI = require("../API/batch.API");
const teamsAPI = require("../API/teams.API");
const seasonStatsAPI = require("../API/seasonStats.API");
const admin = require('firebase-admin');
const firestore = admin.firestore();

const assignRosters = (players) => {
    let teams = {};
    players.forEach(player => {
        let team;
        if (Object.keys(teams).includes(player.PLAYERS.Team)) team = teams[player.PLAYERS.Team];
        else {
            team = {};
            teams[player.PLAYERS.Team] = team;
            team.name = player.PLAYERS.Team;
            team.players = [];
        }
        if (!team.players) team.players = [];
        team.players.push(player.PLAYERS)
        team.players[team.players.length - 1].Salary = player.SALARY.Salary;
    });
    return teams;
}

exports.updateTeams = async function (players) {
    let [season10Stats, teamMeta, teamLeadership, rosters] = await Promise.all([seasonStatsAPI.getSeason10(), teamsAPI.getTeamMeta(), teamsAPI.getTeamLeadership(players), assignRosters(players)])

    let teams = {};
    const addToTeams = ([name, data]) => teams[name] = Object.assign((teams[name] || {}), data);
    Object.entries(season10Stats).forEach(addToTeams);
    Object.entries(teamMeta).forEach(addToTeams);
    Object.entries(teamLeadership).forEach(addToTeams);
    Object.entries(rosters).forEach(addToTeams);
    teams = Object.values(teams);
    const collection = firestore.collection("teams");

    if (teams.some(t => t.name === "#N/A")) {
        teams = teams.filter(t => t.name !== "#N/A");
    }

    return await batchAPI.writeBatches(collection, teams, (a) => a.name);
}




