const s11StatsAPI = require("../API/s11Stats.API");
const batch = require("../API/batch.API");
const firestore = require('firebase-admin').firestore();


exports.getS11Stats = async (fixture) => {
    let result = await s11StatsAPI.getS11Stats();
    let matches = Object.entries(fixture).reduce( (reducer, [k,v]) => {
        reducer[k] = v.matches;
        return reducer;
    }, {});
    let meta = Object.values(fixture).map(r => Object.assign(r, {matches: undefined}));
    // Place match results into fixtures
    Object.values(result).forEach(r => {
        let week = matches[r.meta.match];
        let match = week.filter(m => r.teams.includes(m.home) && r.teams.includes(m.away))[0];
        if(match){
            if(!match.stats) match.stats = {};
            match.stats[r.meta.league] = r;
        }
        else{
            console.log(
                `
|----- Invalid replay found (?) -----|
       - Home Team: ${r.teams[0]}
       - Away Team: ${r.teams[1]}
       - League: ${r.meta.league}
       - Season: ${r.meta.season}
       - Match: ${r.meta.match}
       - Series: ${r.meta.series}
`
            )
        }
    })

    let promises = [];
    const collection = firestore.collection("s11");

    promises.push(await batch.writeBatches(collection, meta, (a)=>`Match ${a.match}`));

    for(let key in matches){
        let subcollection = firestore.collection("s11").doc(`Match ${key}`).collection("series");
        let data = matches[key];
        data.forEach(d => d.teams = [d.home, d.away])
        let i=0;
        promises.push(batch.writeBatches(subcollection, data, ()=> {
            return (i++).toString();
        }));
    }
    await Promise.all(promises);
}
