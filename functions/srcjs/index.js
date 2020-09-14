const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const admin = require('firebase-admin');
admin.initializeApp();
const firestore = admin.firestore();
firestore.settings({ignoreUndefinedProperties:true});
const {OAuth2Client} = require('google-auth-library');
const players = require("./funcs/players");
const teams = require("./funcs/teams");
const s11schedule = require ("./funcs/s11schedule");
const s11stats = require("./funcs/s11Stats");


const updateDatabase = async()=>{
    await Promise.all([
        await players.updatePlayers().then(players => teams.updateTeams(players)),
        await s11schedule.updateSchedule().then(fixture => s11stats.getS11Stats(fixture)),
    ])


    await firestore.collection("metadata").doc("metadata").set({
        last_updated: new Date().getTime()
    });
    console.log("All Done!");
}

exports.scheduledUpdatePlayerDirectory = functions.pubsub.schedule("0 0 * * *").onRun(async (c) => {
    await updateDatabase();
});

exports.populateLocaleDatabase = functions.runWith({timeoutSeconds: 540}).https.onRequest(async (req, res) => {
    await updateDatabase();
    res.json("Done!");
})