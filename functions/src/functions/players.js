"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePlayers = void 0;
const admin = require("firebase-admin");
const firestore = admin.firestore();
const playerAPI = require("../api/players.API");
const batchAPI = require("../api/batch.API");
const BatchModels_1 = require("../models/BatchModels");
async function updatePlayers() {
    const [directory, games, ineligible] = await playerAPI.getPlayerDirectory();
    const [mleIds, currentRanks] = await playerAPI.getReferenceData();
    const collection = firestore.collection("players");
    const docs = Object.entries(directory).map(([mleid, data]) => {
        let gameData = games[mleid];
        let player_meta = mleIds[mleid];
        let ranks = currentRanks[mleid];
        let newAccounts = {};
        if (data.ACCOUNTS) {
            Object.entries(data.ACCOUNTS).forEach(([key, value]) => {
                if (!value.startsWith("https"))
                    return;
                let segments = value.split("/");
                newAccounts[key] = {
                    platform: segments[5],
                    id: segments[6]
                };
            });
        }
        data.ACCOUNTS = newAccounts;
        return Object.assign({
            games: gameData,
            meta: player_meta,
            ranks,
            eligible: !Object.keys(ineligible).includes(mleid)
        }, data);
    });
    await batchAPI.writeBatches([new BatchModels_1.PrebatchData(collection, docs, (a) => a.meta.MLEID)]);
    return docs;
}
exports.updatePlayers = updatePlayers;
//# sourceMappingURL=players.js.map