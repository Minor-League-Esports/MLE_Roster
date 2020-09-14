"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDatabase = void 0;
const admin = require("firebase-admin");
const players_1 = require("./players");
const teams_1 = require("./teams");
const firestore = admin.firestore();
const s11stats_1 = require("./s11stats");
async function updateDatabase() {
    // Update Team Rosters and Player Stats
    await players_1.updatePlayers().then(players => teams_1.updateTeams(players));
    // Update Season 11 statistics
    await s11stats_1.updateS11Schedule().then(fixture => s11stats_1.getS11Stats(fixture));
    // Update last_updated variable
    await firestore.collection("metadata").doc("metadata").set({
        last_updated: new Date().getTime()
    });
    console.log("Update complete.");
}
exports.updateDatabase = updateDatabase;
//# sourceMappingURL=database.js.map