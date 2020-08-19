const CONFIG_SHEET_ID = "13yPS53Oe4B97pRsPM9bV4GFvs6b_nZ6KiqPqjCQDb6E";
const util = require('../util');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firestore = admin.firestore();

const CONFIG_CLIENT_ID = functions.config().google.client_id;
const CONFIG_CLIENT_SECRET = functions.config().google.client_secret;

const sheets = require('../sheets')
const playersAPI = require("../API/players.API");
const batchAPI = require("../API/batch.API");

async function updatePlayerDirectoryAndGames() {
    let [directory, games, ineligible] = await playersAPI.getPlayerDirectory();
    let [mleIds, currentRanks] = await playersAPI.getReferenceData();

    const collection = firestore.collection("players");

    let docs = Object.entries(directory).map(([mleid, data]) => {
        let gameData = games[mleid];
        let player_meta = mleIds[mleid];
        let ranks = currentRanks[mleid];
        return Object.assign({
            games: gameData,
            meta: player_meta,
            ranks,
            eligible: !Object.keys(ineligible).includes(mleid)
        }, data)
    })

    return await batchAPI.writeBatches(collection, docs, (a)=>a.meta.MLEID);
}

exports.updatePlayers = async function () {
    return await updatePlayerDirectoryAndGames();
}
