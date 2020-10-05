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
exports.updateS11Standings = exports.updateS11Schedule = exports.getS11Stats = void 0;
const s11StatsAPI = require("../api/Season11Stats.API");
const batch = require("../api/batch.API");
const admin = require("firebase-admin");
const BatchModels_1 = require("../models/BatchModels");
const firestore = admin.firestore();
async function getS11Stats(fixture) {
    console.log("Updating season 11 statistics");
    const result = await s11StatsAPI.getS11Stats();
    const games = Object.entries(fixture).reduce((reducer, [k, v]) => {
        reducer[k] = v.matches;
        return reducer;
    }, {});
    const meta = Object.values(fixture).map((r) => {
        const { matches } = r, extra = __rest(r, ["matches"]);
        return extra;
    });
    // Place match results into fixtures
    Object.values(result).forEach((r) => {
        const week = games[r.meta.match];
        const match = week.filter((m) => r.teams.includes(m.home) && r.teams.includes(m.away))[0];
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
    const prebatch = [];
    const output = [];
    const collection = firestore.collection("s11");
    prebatch.push(new BatchModels_1.PrebatchData(collection, meta, (a) => `Match ${a.match}`));
    for (const key in games) {
        const subcollection = firestore.collection(`s11`).doc(`Match ${key}`).collection("series");
        const data = games[key];
        let i = 0;
        data.forEach((d) => {
            const { stats } = d, outerdata = __rest(d, ["stats"]);
            outerdata.teams = [d.home, d.away];
            if (stats) {
                outerdata.hasStats = true;
                outerdata.leagues = {};
                Object.keys(stats).forEach(league => {
                    if (!outerdata.leagues[league])
                        outerdata.leagues[league] = {};
                    outerdata.leagues[league].homeScore = stats[league].games.filter((g) => g.winner === d.home).length;
                    outerdata.leagues[league].awayScore = stats[league].games.filter((g) => g.winner === d.away).length;
                });
            }
            // A closure is used here to encapsulate the value of i
            const prebatchData = new BatchModels_1.PrebatchData(subcollection, [outerdata], (() => {
                const index = `Series ${++i}`;
                return (a) => index.toString();
            })());
            prebatch.push(prebatchData);
            output.push(prebatchData);
            const statsCollection = firestore.collection(`s11`).doc(`Match ${key}`).collection("series").doc(`Series ${i}`).collection("stats");
            if (stats) {
                Object.entries(stats).forEach(([league, document]) => {
                    document.home = d.home;
                    document.away = d.away;
                    prebatch.push(new BatchModels_1.PrebatchData(statsCollection, [document], (a) => league, { maxBatchSize: 50 }));
                });
            }
        });
    }
    await batch.writeBatches(...prebatch);
    return output;
}
exports.getS11Stats = getS11Stats;
async function updateS11Schedule() {
    console.log("Updating season 11 schedule");
    const output = await s11StatsAPI.getHomeAway();
    console.log("Done updating season 11 schedule");
    return output;
}
exports.updateS11Schedule = updateS11Schedule;
async function updateS11Standings(stats) {
    const data = BatchModels_1.PrebatchData.deconstruct(stats);
    const teamScores = {};
    data.forEach((match) => {
        const homeTeam = match.home;
        const awayTeam = match.away;
        if (!Object.keys(teamScores).includes(homeTeam))
            teamScores[homeTeam] = {};
        if (!Object.keys(teamScores).includes(awayTeam))
            teamScores[awayTeam] = {};
        if (match.leagues) {
            Object.keys(match.leagues).forEach((league) => {
                var _a, _b, _c, _d;
                if (!teamScores[homeTeam][league])
                    teamScores[homeTeam][league] = {};
                if (!teamScores[awayTeam][league])
                    teamScores[awayTeam][league] = {};
                // Home Team
                teamScores[homeTeam][league].win = ((_a = teamScores[homeTeam][league].win) !== null && _a !== void 0 ? _a : 0) + match.leagues[league].homeScore;
                teamScores[homeTeam][league].lose = ((_b = teamScores[homeTeam][league].lose) !== null && _b !== void 0 ? _b : 0) + match.leagues[league].awayScore;
                teamScores[awayTeam][league].win = ((_c = teamScores[awayTeam][league].win) !== null && _c !== void 0 ? _c : 0) + match.leagues[league].awayScore;
                teamScores[awayTeam][league].lose = ((_d = teamScores[awayTeam][league].lose) !== null && _d !== void 0 ? _d : 0) + match.leagues[league].homeScore;
            });
        }
    });
    const teamsCollection = firestore.collection("teams");
    await batch.writeBatches(new BatchModels_1.PrebatchData(teamsCollection, Object.entries(teamScores).map(([teamName, standings]) => {
        return {
            name: teamName,
            standings: {
                s11: standings
            }
        };
    }), (a) => a.name, { merge: true }));
}
exports.updateS11Standings = updateS11Standings;
//# sourceMappingURL=s11stats.js.map