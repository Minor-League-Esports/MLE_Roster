import * as admin from "firebase-admin";
const firestore = admin.firestore();
import * as teamsAPI from "../api/teams.API";
import * as teamStatsAPI from "../api/TeamStats.API";
import * as batchAPI from "../api/batch.API";
import {PrebatchData} from "../models/BatchModels";

const assignRosters = (players: any[]) => {
    const teams: any = {};
    players.forEach(player => {
        let team: any;
        if (Object.keys(teams).includes(player.PLAYERS.Team)) team = teams[player.PLAYERS.Team];
        else {
            team = {};
            teams[player.PLAYERS.Team] = team;
            team.name = player.PLAYERS.Team;
            team.players = [];
        }
        if (!team.players) team.players = [];

        team.players.push(firestore.doc(`players/${player.PLAYERS.MLEID}`));

    });
    return teams;
}

export async function updateTeams(players: any[]){
    const [seasonStats, teamMeta, teamLeadership, rosters] = await Promise.all([
        teamStatsAPI.getStats(),
        teamsAPI.getTeamMeta(),
        teamsAPI.getTeamLeadership(players),
        assignRosters(players)]
    )

    const teams: any = {};
    const addToTeams = ([name, data]: [string, any]) => teams[name] = Object.assign((teams[name] || {}), data);
    Object.entries(seasonStats).forEach(addToTeams);
    Object.entries(teamMeta).forEach(addToTeams);
    Object.entries(teamLeadership).forEach(addToTeams);
    Object.entries(rosters).forEach(addToTeams);
    let docs = Object.values(teams);
    const collection = firestore.collection("teams");

    if (docs.some((t: any) => t.name === "#N/A")) {
        docs = docs.filter((t: any) => t.name !== "#N/A");
    }
    await batchAPI.writeBatches(new PrebatchData(collection, docs, (a: any) => a.name));
    console.log("Done updating teams...");
}