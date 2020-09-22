import * as functions from 'firebase-functions';

import * as admin from 'firebase-admin';
admin.initializeApp();
const firestore = admin.firestore();
firestore.settings({ignoreUndefinedProperties: true})
import * as database from "./functions/database";
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


/**
 * Scheduled job that runs nightly at Midnight Pacific Time
 */
exports.scheduledUpdatePlayerDirectory = functions.runWith({memory:"1GB"}).pubsub.schedule("0 0 * * *").onRun(async (c) => {
    await database.updateDatabase();
});

/**
 * Used for local testing and manual pushes
 */
exports.populateLocaleDatabase = functions.runWith({timeoutSeconds: 540, memory:"1GB"}).https.onRequest(async (req, res) => {
    await database.updateDatabase();
    res.json("Done!");
})