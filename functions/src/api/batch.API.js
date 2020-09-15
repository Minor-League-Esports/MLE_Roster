"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeBatches = void 0;
const BatchModels_1 = require("../models/BatchModels");
const admin = require('firebase-admin');
const firestore = admin.firestore();
let i = 0;
async function writeBatch(documents) {
    const batch = firestore.batch();
    documents.data.forEach(document => {
        if (document.key) {
            batch.set(document.collection.doc(document.key), document.document);
        }
        else {
            console.log("Missing keypath on object!");
            console.log(document);
        }
    });
    return batch.commit();
}
/**
 * Converts PrebatchData to a Batch, and then commits the batch accordingly.
 */
async function writeBatches(data) {
    const opid = i++;
    console.log(`(${opid}) | Starting a write operation...`);
    const batch = new BatchModels_1.Batch([]);
    // Convert all the PrebatchDatas to BatchDatas and include in the Batch
    let batchSize = Number.MAX_SAFE_INTEGER;
    data.forEach(collectionScopedData => {
        if (collectionScopedData.maxBatchSize < batchSize)
            batchSize = collectionScopedData.maxBatchSize;
        collectionScopedData.documents.forEach(document => {
            batch.data.push(new BatchModels_1.BatchData(collectionScopedData.collection, document, collectionScopedData.keypath(document)));
        });
    });
    // Run in parallel
    // let promises: Promise<any>[] = [];
    // let documents: Batch[] = batch.getChunks(500);
    // documents.forEach(b => promises.push(writeBatch(b)));
    // await Promise.all(promises);
    // Run in sequence
    console.log(`(${opid}) | Batching with a max of ${batchSize} documents`);
    const documents = batch.getChunks(batchSize);
    console.log(`(${opid}) | Using ${documents.length} batch(es)`);
    for (const document of documents) {
        await writeBatch(document); //eslint-disable-line no-await-in-loop
    }
    console.log(`(${opid}) | Done writing`);
}
exports.writeBatches = writeBatches;
//# sourceMappingURL=batch.API.js.map