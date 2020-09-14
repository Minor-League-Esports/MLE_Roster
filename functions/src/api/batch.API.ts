import {Batch, BatchData, PrebatchData} from "../models/BatchModels";
const admin = require('firebase-admin');
const firestore = admin.firestore();

async function writeBatch(documents: Batch){
    let batch = firestore.batch();
    documents.data.forEach(document => {
        if(document.key){
            batch.set(document.collection.doc(document.key), document.document);
        } else {
            console.log("Missing keypath on object!");
            console.log(document);
        }
    })

    return batch.commit();
}

/**
 * Converts PrebatchData to a Batch, and then commits the batch accordingly.
 */
export async function writeBatches(data: PrebatchData[]){
    console.log("Starting a write operation...");
    let batch: Batch = new Batch([]);
    // Convert all the PrebatchDatas to BatchDatas and include in the Batch
    data.forEach(collectionScopedData => {
        collectionScopedData.documents.forEach(document => {
            batch.data.push(new BatchData(collectionScopedData.collection, document, collectionScopedData.keypath(document)));
        })
    });
    let promises: Promise<any>[] = [];
    let documents: Batch[] = batch.getChunks(500);
    documents.forEach(b => promises.push(writeBatch(b)));
    await Promise.all(promises);
}