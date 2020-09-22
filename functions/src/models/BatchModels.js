"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Batch = exports.BatchData = exports.PrebatchData = void 0;
class PrebatchData {
    constructor(collection, documents, keypath, options = {}) {
        var _a, _b;
        this.collection = collection;
        this.documents = documents;
        this.keypath = keypath;
        this.maxBatchSize = (_a = options.maxBatchSize) !== null && _a !== void 0 ? _a : 500;
        this.merge = (_b = options.merge) !== null && _b !== void 0 ? _b : false;
    }
    static deconstruct(data) {
        return data.reduce((reducer, currentValue) => {
            return [...reducer, ...currentValue.documents];
        }, []);
    }
}
exports.PrebatchData = PrebatchData;
class BatchData {
    constructor(collection, document, key, merge = false) {
        this.collection = collection;
        this.document = document;
        this.key = key;
        this.merge = merge;
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
            }
            total[i].data.push(current);
            return total;
        }, [new Batch([])]);
    }
}
exports.Batch = Batch;
//# sourceMappingURL=BatchModels.js.map