const s11fixtureAPI = require("../API/s11Fixture.API");


exports.updateSchedule = async function(){
    return await s11fixtureAPI.getHomeAway();
}