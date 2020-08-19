const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firestore = admin.firestore();


const s11fixtureAPI = require("../API/s11Fixture.API");
const batch = require("../API/batch.API");

exports.updateSchedule = async function(){
    let homeAway = await s11fixtureAPI.getHomeAway();

    const collection = firestore.collection("seasons");
    return await batch.writeBatches(collection, [homeAway], ()=>"s11");
}