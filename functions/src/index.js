"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const firestore = admin.firestore();
firestore.settings({ ignoreUndefinedProperties: true });
const database = require("./functions/database");
const pubsub_1 = require("./helpers/pubsub");
const Job_1 = require("./models/JobModels/Job");
const JobRouter_1 = require("./models/JobModels/JobRouter");
const LZUTF8 = require("lzutf8");
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
exports.scheduledUpdatePlayerDirectory = functions.runWith({ memory: "1GB" }).pubsub.schedule("0 0 * * *").onRun(async (c) => {
    await database.updateDatabase();
});
exports.runUpdateJob = functions.runWith({ memory: "1GB" }).pubsub.topic("mler_db_jobs").onPublish(async (message, context) => {
    var _a;
    // Deserialize the job to execute
    const job = Job_1.Job.fromJSON(message.json);
    if (job.data)
        job.data = JSON.parse(LZUTF8.decompress(job.data, { inputEncoding: "Base64" }));
    // Also deserialize child jobs, to n+1 depth
    job.childJobs = job.childJobs.map(j => Job_1.Job.fromJSON(j));
    // Execute job
    if (job.jobType !== undefined) {
        await ((_a = JobRouter_1.JobRouter.get(job.jobType)) === null || _a === void 0 ? void 0 : _a.run(job));
    }
    else {
        console.error(`Invalid job type found in job ${job.description}! ${job.jobType}`);
    }
    // Push all child jobs
    await Promise.all(job.childJobs.map(childJob => pubsub_1.pubsubClient.topic("mler_db_jobs").publish(Buffer.from(childJob.json))));
});
/**
 * Used for local testing and manual pushes
 */
exports.populateLocaleDatabase = functions.runWith({
    timeoutSeconds: 540,
    memory: "1GB"
}).https.onRequest(async (req, res) => {
    await database.updateDatabase();
    res.json("Done!");
});
//# sourceMappingURL=index.js.map