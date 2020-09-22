import * as admin from "firebase-admin";

export interface PrebatchOptions {
    maxBatchSize?: number;
    merge?: boolean;
}

export class PrebatchData {
    static deconstruct(data: PrebatchData[]): any[]{
        return data.reduce((reducer: any[], currentValue: PrebatchData)=>{
            return [...reducer, ...currentValue.documents];
        }, [])
    }

    collection: admin.firestore.CollectionReference;
    documents: any[];
    keypath: (a: any) => string;
    maxBatchSize: number;
    merge: boolean;

    constructor(collection: admin.firestore.CollectionReference,
                documents: any[],
                keypath: (a: any) => string,
                options: PrebatchOptions = {}) {
        this.collection = collection;
        this.documents = documents;
        this.keypath = keypath;
        this.maxBatchSize = options.maxBatchSize ?? 500;
        this.merge = options.merge ?? false;
    }

}

export class BatchData {
    collection: admin.firestore.CollectionReference;
    document: any;
    key: string;
    merge: boolean;
    constructor(collection: admin.firestore.CollectionReference,
                document: any,
                key: string,
                merge: boolean = false){
        this.collection = collection;
        this.document = document;
        this.key = key;
        this.merge = merge;
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