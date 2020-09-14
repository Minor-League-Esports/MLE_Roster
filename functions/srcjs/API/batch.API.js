const admin = require('firebase-admin');
const firestore = admin.firestore();

/**
 * @param collection {firebase.firestore.CollectionReference}
 * @param docs {Any[]}
 * @param keyPath {function(*): string}
 * @returns {Promise<FirebaseFirestore.WriteResult[]>}
 */
const writeBatch = async function(collection, docs, keyPath){
    let batch = firestore.batch();
    docs.forEach(data => {
        if(keyPath(data)){
            batch.set(collection.doc(keyPath(data)), data);
        } else {
            console.log("Missing keypath on object!");
            console.log(data);
        }
    })
    return await batch.commit();
}

/**
 * @param collection {firebase.firestore.CollectionReference}
 * @param docs {Any[]}
 * @param keyPath {function(*): string}
 * @returns {Promise<Any[]>}
 */
exports.writeBatches = async function(collection, docs, keyPath) {
    console.log("Starting a write operation...");
    let i = 0;
    let batched_docs = docs.reduce((output, current) => {
        // Ensure we are not going over 500 in each array
        i%=500;
        if(i++ === 0){
            output.push([]);
        }
        output[output.length-1].push(current);
        return output;
    }, []);
    let promises = [];
    batched_docs.forEach((batch, i) => {
        console.log("Committing batch #" + i);
        promises.push(writeBatch(collection, batch, keyPath))
    });

    await Promise.all(promises);
    console.log("Done!");
    return docs;
}