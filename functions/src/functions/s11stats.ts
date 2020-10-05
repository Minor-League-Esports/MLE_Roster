import * as s11StatsAPI from "../api/Season11Stats.API";
import * as batch from "../api/batch.API";
import * as admin from "firebase-admin";
import {PrebatchData} from "../models/BatchModels";

const firestore = admin.firestore();

export async function getS11Stats(fixture: any): Promise<PrebatchData[]> {
    console.log("Updating season 11 statistics");
    const result = await s11StatsAPI.getS11Stats();
    const games = Object.entries(fixture).reduce((reducer: any, [k, v]: [string, any]) => {
        reducer[k] = v.matches;
        return reducer;
    }, {});
    const meta = Object.values(fixture).map((r: any) => {
        const {matches, ...extra} = r;
        return extra;
    });
    // Place match results into fixtures
    Object.values(result).forEach((r: any) => {
        const week = games[r.meta.match];
        const match = week.filter((m: any) => r.teams.includes(m.home) && r.teams.includes(m.away))[0];
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

    const prebatch: PrebatchData[] = [];
    const output: PrebatchData[] = [];
    const collection = firestore.collection("s11");

    prebatch.push(new PrebatchData(collection, meta, (a: any) => `Match ${a.match}`));
    for (const key in games) {
        const subcollection = firestore.collection(`s11`).doc(`Match ${key}`).collection("series");
        const data = games[key];
        let i = 0;
        data.forEach((d: any) => {
            const {stats, ...outerdata} = d;
            outerdata.teams = [d.home, d.away];
            if (stats) {
                outerdata.hasStats = true;
                outerdata.leagues = {}
                Object.keys(stats).forEach(league => {
                    if(!outerdata.leagues[league]) outerdata.leagues[league] = {};
                    outerdata.leagues[league].homeScore = stats[league].games.filter((g: any) => g.winner === d.home).length;
                    outerdata.leagues[league].awayScore = stats[league].games.filter((g: any) => g.winner === d.away).length;
                });
            }
            // A closure is used here to encapsulate the value of i
            const prebatchData = new PrebatchData(subcollection, [outerdata], (
                () => {
                    const index = `Series ${++i}`;
                    return (a: any) => index.toString();
                }
            )())
            prebatch.push(prebatchData);
            output.push(prebatchData);
            const statsCollection = firestore.collection(`s11`).doc(`Match ${key}`).collection("series").doc(`Series ${i}`).collection("stats");
            if (stats) {
                Object.entries(stats).forEach(([league, document]: [string, any]) => {
                    document.home = d.home;
                    document.away = d.away;
                    prebatch.push(new PrebatchData(statsCollection, [document], (a: any) => league, {maxBatchSize: 50}));
                })
            }
        })
    }
    await batch.writeBatches(...prebatch);
    return output;
}

export async function updateS11Schedule() {
    console.log("Updating season 11 schedule");
    const output = await s11StatsAPI.getHomeAway();
    console.log("Done updating season 11 schedule");
    return output;
}

export async function updateS11Standings(stats: any[]) {
    const teamScores: any = {};
    stats.forEach((match: any) => {
        const homeTeam: string = match.home;
        const awayTeam: string = match.away;
        if (!Object.keys(teamScores).includes(homeTeam)) teamScores[homeTeam] = {};
        if (!Object.keys(teamScores).includes(awayTeam)) teamScores[awayTeam] = {};

        if(match.leagues){
            Object.keys(match.leagues).forEach((league: string) => {
                if(!teamScores[homeTeam][league]) teamScores[homeTeam][league] = {};
                if(!teamScores[awayTeam][league]) teamScores[awayTeam][league] = {};
                // Home Team
                teamScores[homeTeam][league].win = (teamScores[homeTeam][league].win ?? 0) + match.leagues[league].homeScore;
                teamScores[homeTeam][league].lose = (teamScores[homeTeam][league].lose ?? 0) + match.leagues[league].awayScore;

                teamScores[awayTeam][league].win = (teamScores[awayTeam][league].win ?? 0) + match.leagues[league].awayScore;
                teamScores[awayTeam][league].lose = (teamScores[awayTeam][league].lose ?? 0) + match.leagues[league].homeScore;
            })
        }
    });

    const teamsCollection = firestore.collection("teams");

    await batch.writeBatches(
        new PrebatchData(
            teamsCollection,
            Object.entries(teamScores).map(([teamName, standings]: [string, any])=>{
                return {
                    name: teamName,
                    standings: {
                        s11: standings
                    }
                }
            }),
            (a:any) => a.name,
            {merge: true}
        )
    );
}