import * as admin from "firebase-admin";
import {updatePlayers} from "./players";
import {updateTeams} from "./teams";
const firestore = admin.firestore();
import {getS11Stats, updateS11Schedule, updateS11Standings} from "./s11stats";


export async function updateDatabase(): Promise<void> {

    // Update Team Rosters and Player Stats
    await updatePlayers().then(players => updateTeams(players));
    // Update Season 11 statistics
    await updateS11Schedule().then(fixture => getS11Stats(fixture).then(stats => updateS11Standings(stats)));

    // Update last_updated variable
    await firestore.collection("metadata").doc("metadata").set({
        last_updated: new Date().getTime()
    });
    console.log("Update complete.");
}