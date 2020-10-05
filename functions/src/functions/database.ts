import * as admin from "firebase-admin";

const firestore = admin.firestore();


import {pubsubClient} from "../helpers/pubsub";
import {directoryJobChain, season11JobChain, updateMetadataJobChain} from "../models/JobModels/Jobs";

export async function updateMetadata() {
    await firestore.collection("metadata").doc("metadata").set({
        last_updated: new Date().getTime()
    });
    return true;
}


export async function updateDatabase(): Promise<void> {
    console.log("=------------------------------------------=");
    console.log("=------------------------------------------=");
    console.log("=------------------------------------------=");
    console.log("=------------------------------------------=");
    console.log("=------------------------------------------=");
    await Promise.all([
        pubsubClient.topic("mler_db_jobs").publish(Buffer.from(directoryJobChain.json)),
        pubsubClient.topic("mler_db_jobs").publish(Buffer.from(season11JobChain.json)),
        pubsubClient.topic("mler_db_jobs").publish(Buffer.from(updateMetadataJobChain.json))
    ]);
    return;
}