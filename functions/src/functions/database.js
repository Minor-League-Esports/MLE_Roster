"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDatabase = exports.updateMetadata = void 0;
const admin = require("firebase-admin");
const firestore = admin.firestore();
const pubsub_1 = require("../helpers/pubsub");
const Jobs_1 = require("../models/JobModels/Jobs");
async function updateMetadata() {
    await firestore.collection("metadata").doc("metadata").set({
        last_updated: new Date().getTime()
    });
    return true;
}
exports.updateMetadata = updateMetadata;
async function updateDatabase() {
    console.log("=------------------------------------------=");
    console.log("=------------------------------------------=");
    console.log("=------------------------------------------=");
    console.log("=------------------------------------------=");
    console.log("=------------------------------------------=");
    await Promise.all([
        pubsub_1.pubsubClient.topic("mler_db_jobs").publish(Buffer.from(Jobs_1.directoryJobChain.json)),
        pubsub_1.pubsubClient.topic("mler_db_jobs").publish(Buffer.from(Jobs_1.season11JobChain.json)),
        pubsub_1.pubsubClient.topic("mler_db_jobs").publish(Buffer.from(Jobs_1.updateMetadataJobChain.json))
    ]);
    return;
}
exports.updateDatabase = updateDatabase;
//# sourceMappingURL=database.js.map