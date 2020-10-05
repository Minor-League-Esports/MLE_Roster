import * as functions from 'firebase-functions';

import * as admin from 'firebase-admin';

admin.initializeApp();
const firestore = admin.firestore();
firestore.settings({ignoreUndefinedProperties: true})
import * as database from "./functions/database";
import {pubsubClient} from "./helpers/pubsub";
import {Job} from "./models/JobModels/Job";
import {JobRouter} from "./models/JobModels/JobRouter";


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
exports.scheduledUpdatePlayerDirectory = functions.runWith({memory: "1GB"}).pubsub.schedule("0 0 * * *").onRun(async (c) => {
    await database.updateDatabase();
});

exports.runUpdateJob = functions.runWith({memory: "1GB"}).pubsub.topic("mler_db_jobs").onPublish(async (message, context) => {
    // Deserialize the job to execute
    const job: Job = Job.fromJSON(message.json);
    // Also deserialize child jobs, to n+1 depth
    job.childJobs = job.childJobs.map(j => Job.fromJSON(j));
    // Execute job
    if (job.jobType !== undefined) {
        await JobRouter.get(job.jobType)?.run(job);
    } else {
        console.error(`Invalid job type found in job ${job.description}! ${job.jobType}`)
    }
    // Push all child jobs
    await Promise.all(
        job.childJobs.map(childJob => pubsubClient.topic("mler_db_jobs").publish(Buffer.from(childJob.json)))
    );
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
})