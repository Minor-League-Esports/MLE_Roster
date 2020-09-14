import {Batch, BatchData, PrebatchData} from "../models/BatchModels";
const admin = require('firebase-admin');
const firestore = admin.firestore();

let i = 0;

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
    const opid = i++;
    console.log(`(${opid}) | Starting a write operation...`);
    let batch: Batch = new Batch([]);
    // Convert all the PrebatchDatas to BatchDatas and include in the Batch
    let batchSize = Number.MAX_SAFE_INTEGER;
    data.forEach(collectionScopedData => {
        if(collectionScopedData.maxBatchSize < batchSize) batchSize = collectionScopedData.maxBatchSize
        collectionScopedData.documents.forEach(document => {
            batch.data.push(new BatchData(collectionScopedData.collection, document, collectionScopedData.keypath(document)));
        })
    });
    // Run in parallel
    // let promises: Promise<any>[] = [];
    // let documents: Batch[] = batch.getChunks(500);
    // documents.forEach(b => promises.push(writeBatch(b)));
    // await Promise.all(promises);
    // Run in sequence
    console.log(`(${opid}) | Batching with a max of ${batchSize} documents`)
    let documents: Batch[] = batch.getChunks(batchSize);

    for(let i=0; i<documents.length; i++){
        await writeBatch(documents[i]);
    }
    console.log(`(${opid}) | Done writing`);
}