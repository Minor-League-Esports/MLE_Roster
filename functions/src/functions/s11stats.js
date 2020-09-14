"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateS11Schedule = exports.getS11Stats = void 0;
const s11StatsAPI = require("../api/Season11Stats.API");
const batch = require("../api/batch.API");
const admin = require("firebase-admin");
const BatchModels_1 = require("../models/BatchModels");
const firestore = admin.firestore();
async function getS11Stats(fixture) {
    console.log("Updating season 11 statistics");
    let result = await s11StatsAPI.getS11Stats();
    let matches = Object.entries(fixture).reduce((reducer, [k, v]) => {
        reducer[k] = v.matches;
        return reducer;
    }, {});
    let meta = Object.values(fixture).map((r) => {
        const { matches } = r, output = __rest(r, ["matches"]);
        return output;
    });
    // Place match results into fixtures
    Object.values(result).forEach((r) => {
        let week = matches[r.meta.match];
        let match = week.filter((m) => r.teams.includes(m.home) && r.teams.includes(m.away))[0];
        if (match) {
            if (!match.stats)
                match.stats = {};
            match.stats[r.meta.league] = r;
        }
        else {
            console.log(`
|----- Invalid replay found (?) -----|
       - Home Team: ${r.teams[0]}
       - Away Team: ${r.teams[1]}
       - League: ${r.meta.league}
       - Season: ${r.meta.season}
       - Match: ${r.meta.match}
       - Series: ${r.meta.series}
`);
        }
    });
    let prebatch = [];
    const collection = firestore.collection("s11");
    prebatch.push(new BatchModels_1.PrebatchData(collection, meta, (a) => `Match ${a.match}`));
    for (let key in matches) {
        let subcollection = firestore.collection(`s11`).doc(`Match ${key}`).collection("series");
        let data = matches[key];
        let i = 0;
        data.forEach((d) => {
            let { stats } = d, outerdata = __rest(d, ["stats"]);
            outerdata.teams = [d.home, d.away];
            if (stats) {
                outerdata.hasStats = true;
            }
            prebatch.push(
            // A closure is used here to encapsulate the value of i
            new BatchModels_1.PrebatchData(subcollection, [outerdata], (() => {
                const index = `Series ${++i}`;
                return (a) => index.toString();
            })()));
            let statscollection = firestore.collection(`s11`).doc(`Match ${key}`).collection("series").doc(`Series ${i}`).collection("stats");
            if (stats) {
                Object.entries(stats).forEach(([league, data]) => {
                    data.home = d.home;
                    data.away = d.away;
                    prebatch.push(new BatchModels_1.PrebatchData(statscollection, [data], (a) => league, 50));
                });
            }
        });
    }
    await batch.writeBatches(prebatch);
}
exports.getS11Stats = getS11Stats;
async function updateS11Schedule() {
    console.log("Updating season 11 schedule");
    const output = await s11StatsAPI.getHomeAway();
    console.log("Done updating season 11 schedule");
    return output;
}
exports.updateS11Schedule = updateS11Schedule;
//# sourceMappingURL=s11stats.js.map