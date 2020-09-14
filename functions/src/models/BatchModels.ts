import * as admin from "firebase-admin";


export class PrebatchData {
    collection: admin.firestore.CollectionReference;
    documents: any[];
    keypath: (a: any) => string;
    maxBatchSize: number;

    constructor(collection: admin.firestore.CollectionReference,
                documents: any[],
                keypath: (a: any) => string,
                maxBatchSize: number = 500) {
        this.collection = collection;
        this.documents = documents;
        this.keypath = keypath;
        this.maxBatchSize = maxBatchSize;
    }
}

export class BatchData {
    collection: admin.firestore.CollectionReference;
    document: any;
    key: string;
    constructor(collection: admin.firestore.CollectionReference,
                document: any,
                key: string){
        this.collection = collection;
        this.document = document;
        this.key = key;
    }
}

export class Batch {
    data: BatchData[];

    constructor(data: BatchData[]){
        this.data = data;
    }

    getChunks(chunkSize: number = 500): Batch[]{
        let i = 0;
        // @ts-ignore
        return this.data.reduce((total: Batch[], current: BatchData) => {
            // debugger;
            if(total[i].data.length === chunkSize){
                i += 1;
                total.push(new Batch([]));
            }
            total[i].data.push(current);

            return total;
        },[new Batch([])])
    }
}