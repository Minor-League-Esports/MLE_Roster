import * as admin from "firebase-admin";

const firestore = admin.firestore();
import * as playerAPI from "../api/players.API";
import * as batchAPI from "../api/batch.API";
import {PrebatchData} from "../models/BatchModels";


export async function updatePlayers() {
    const [directory, games, ineligible] = await playerAPI.getPlayerDirectory();
    const [mleIds, currentRanks] = await playerAPI.getReferenceData();

    const collection = firestore.collection("players");

    const docs = Object.entries(directory).map(([mleid, data]: [string, any]) => {
        const gameData = games[mleid];
        const player_meta = mleIds[mleid];
        const ranks = currentRanks[mleid];
        const newAccounts: any = {};
        if (data.ACCOUNTS) {
            Object.entries(data.ACCOUNTS).forEach(([key, value]: [string, any]) => {
                if (!value.startsWith("https")) return;
                const segments = value.split("/");
                newAccounts[key] = {
                    platform: segments[5],
                    id: segments[6]
                }
            });
        }
        data.ACCOUNTS = newAccounts;
        return Object.assign({
            games: gameData,
            meta: player_meta,
            ranks,
            eligible: !Object.keys(ineligible).includes(mleid)
        }, data)
    });
    await batchAPI.writeBatches(new PrebatchData(collection, docs, (a: any) => a.meta.MLEID));
    return docs;
}