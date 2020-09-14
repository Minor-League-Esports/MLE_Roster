"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Batch = exports.BatchData = exports.PrebatchData = void 0;
class PrebatchData {
    constructor(collection, documents, keypath) {
        this.collection = collection;
        this.documents = documents;
        this.keypath = keypath;
    }
}
exports.PrebatchData = PrebatchData;
class BatchData {
    constructor(collection, document, key) {
        this.collection = collection;
        this.document = document;
        this.key = key;
    }
}
exports.BatchData = BatchData;
class Batch {
    constructor(data) {
        this.data = data;
    }
    getChunks(chunkSize = 500) {
        let i = 0;
        // @ts-ignore
        return this.data.reduce((total, current) => {
            // debugger;
            if (total[i].data.length === chunkSize) {
                i += 1;
                total.push(new Batch([]));
                console.log("Incrementing i");
            }
            total[i].data.push(current);
            return total;
        }, [new Batch([])]);
    }
}
exports.Batch = Batch;
//# sourceMappingURL=BatchModels.js.map