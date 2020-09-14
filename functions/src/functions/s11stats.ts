import * as s11StatsAPI from "../api/Season11Stats.API";
import * as batch from "../api/batch.API";
import * as admin from "firebase-admin";
import {PrebatchData} from "../models/BatchModels";

const firestore = admin.firestore();

export async function getS11Stats(fixture: any) {
    console.log("Updating season 11 statistics");
    let result = await s11StatsAPI.getS11Stats();
    let matches = Object.entries(fixture).reduce((reducer: any, [k, v]: [string, any]) => {
        reducer[k] = v.matches;
        return reducer;
    }, {});
    let meta = Object.values(fixture).map((r:any) => {
        const {matches, ...output} = r;
        return output;
    });
    // Place match results into fixtures
    Object.values(result).forEach((r: any) => {
        let week = matches[r.meta.match];
        let match = week.filter((m: any) => r.teams.includes(m.home) && r.teams.includes(m.away))[0];
        if (match) {
            if (!match.stats) match.stats = {};
            match.stats[r.meta.league] = r;
        } else {
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

    let prebatch = [];
    const collection = firestore.collection("s11");

    prebatch.push(new PrebatchData(collection, meta, (a: any) => `Match ${a.match}`));
    for (let key in matches) {
        let subcollection = firestore.collection(`s11Stats`);
        let data = matches[key];
        data.forEach((d: any) => d.teams = [d.home, d.away])
        // let i = 0;
        prebatch.push(
            // A closure is used here to encapsulate the value of i
            new PrebatchData(subcollection, data, (
                () => {
                    const index = `Match ${key}`;
                    return (a: any) => index.toString()
                }
            )()));
    }
    await batch.writeBatches(prebatch);
}

export async function updateS11Schedule() {
    console.log("Updating season 11 schedule");
    return s11StatsAPI.getHomeAway();
}