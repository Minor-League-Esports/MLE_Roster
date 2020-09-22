import {Batch, BatchData, PrebatchData} from "../models/BatchModels";
const admin = require('firebase-admin');
const firestore = admin.firestore();

let i = 0;

async function writeBatch(documents: Batch){
    const batch = firestore.batch();
    documents.data.forEach((document: BatchData) => {
        if(document.key){
            batch.set(document.collection.doc(document.key), document.document, {merge: document.merge});
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
export async function writeBatches(...data: PrebatchData[]){
    const opid = i++;
    console.log(`(${opid}) | Starting a write operation...`);
    const batch: Batch = new Batch([]);
    // Convert all the PrebatchDatas to BatchDatas and include in the Batch
    let batchSize = Number.MAX_SAFE_INTEGER;
    data.forEach((collectionScopedData: PrebatchData)=> {
        if(collectionScopedData.maxBatchSize < batchSize) batchSize = collectionScopedData.maxBatchSize
        const merge = collectionScopedData.merge;
        collectionScopedData.documents.forEach((document: any) => {
            try{
                collectionScopedData.keypath(document);
                batch.data.push(new BatchData(collectionScopedData.collection, document, collectionScopedData.keypath(document), merge));
            } catch{
                console.log("Error on keypath for document!")
                console.log(document);
            }
        })
    });
    // Run in parallel
    // let promises: Promise<any>[] = [];
    // let documents: Batch[] = batch.getChunks(500);
    // documents.forEach(b => promises.push(writeBatch(b)));
    // await Promise.all(promises);
    // Run in sequence
    console.log(`(${opid}) | Batching with a max of ${batchSize} documents`);
    const documents: Batch[] = batch.getChunks(batchSize);
    console.log(`(${opid}) | Using ${documents.length} batch(es)`);
    for(const document of documents){
        await writeBatch(document); //eslint-disable-line no-await-in-loop
    }
    console.log(`(${opid}) | Done writing`);
}