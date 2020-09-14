import * as admin from "firebase-admin";
const firestore = admin.firestore();
import * as teamsAPI from "../api/teams.API";
import * as season10StatsAPI from "../api/Season10Stats.API";
import * as batchAPI from "../api/batch.API";
import {PrebatchData} from "../models/BatchModels";

const assignRosters = (players: any[]) => {
    let teams: any = {};
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
    const [season10Stats, teamMeta, teamLeadership, rosters] = await Promise.all([season10StatsAPI.getSeason10(), teamsAPI.getTeamMeta(), teamsAPI.getTeamLeadership(players), assignRosters(players)])

    const teams: any = {};
    const addToTeams = ([name, data]: [string, any]) => teams[name] = Object.assign((teams[name] || {}), data);
    Object.entries(season10Stats).forEach(addToTeams);
    Object.entries(teamMeta).forEach(addToTeams);
    Object.entries(teamLeadership).forEach(addToTeams);
    Object.entries(rosters).forEach(addToTeams);
    let docs = Object.values(teams);
    const collection = firestore.collection("teams");

    if (docs.some((t: any) => t.name === "#N/A")) {
        docs = docs.filter((t: any) => t.name !== "#N/A");
    }
    const output = await batchAPI.writeBatches([new PrebatchData(collection, docs, (a: any) => a.name)]);
    console.log("Done updating teams...");
    return output
}