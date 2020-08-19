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

const updateDatabase = async()=>{
    let active_players = await players.updatePlayers();
    let all_teams = await teams.updateTeams(active_players);
    let s11 = await s11schedule.updateSchedule();
    await firestore.collection("metadata").doc("metadata").set({
        last_updated: new Date().getTime()
    });
    console.log("Done!");
}

exports.scheduledUpdatePlayerDirectory = functions.pubsub.schedule("0 0 * * *").onRun(async (c) => {
    await updateDatabase();
});

exports.populateLocaleDatabase = functions.https.onRequest(async (req, res) => {
    await updateDatabase();
    res.json("Done!");
})