const sheets = require('../sheets');
const util = require("../util");

exports.getSeason10 = async () => {
    console.log("Collecting Season 10 Team Stats");
    const S10Statistics = "1cbKKs1iUHSTDJSzng5KC_56jm-3tjp93w7L-bJ7UuHc";
    let [s10foundation, s10academy, s10champion, s10premier, s10combined] = await sheets.sheetValues(S10Statistics, [
            "Foundation Team Stats!A2:CW19",
            "Academy Team Stats!A2:CW35",
            "Champion Team Stats!A2:CW35",
            "Premier Team Stats!A2:CW35",
            "Combined Team Stats!A2:CZ35",
        ]
    );

    let foundation_labels = s10foundation.data.values.splice(0, 2).map(a => a.map(util.clean));
    let academy_labels = s10academy.data.values.splice(0, 2).map(a => a.map(util.clean));
    let champion_labels = s10champion.data.values.splice(0, 2).map(a => a.map(util.clean));
    let premier_labels = s10premier.data.values.splice(0, 2).map(a => a.map(util.clean));
    let combined_labels = s10combined.data.values.splice(0, 2).map(a => a.map(util.clean));

    let [foundation, academy, champion, premier, combined] = await Promise.all([
        getSeasonStats(s10foundation.data.values, foundation_labels, "10", "foundation"),
        getSeasonStats(s10academy.data.values, academy_labels, "10", "academy"),
        getSeasonStats(s10champion.data.values, champion_labels, "10", "champion"),
        getSeasonStats(s10premier.data.values, premier_labels, "10", "premier"),
        getSeasonStats(s10combined.data.values, combined_labels, "10", "combined"),
    ])
    return await combineSeasonStats(foundation, academy, champion, premier, combined);

}
const getSeasonStats = async (data, labels, season, league) => {
    return data.reduce(async (pP, c) => {
        let [team, p] = await Promise.all([util.coalesce(c, ...labels), pP]);
        if (!p.hasOwnProperty(team.Team)) p[team.Team] = {};
        if (!p[team.Team].hasOwnProperty("stats")) p[team.Team].stats = {};
        if (!p[team.Team].stats.hasOwnProperty("s10")) p[team.Team].stats.s10 = {};
        p[team.Team].stats.s10[league] = team;
        return p;
    }, {});
}
const combineSeasonStats = async (foundation, academy, champion, premier, combined) => {
    for (let teamName in combined) {
        combined[teamName].stats.s10 = Object.assign(
            academy[teamName].stats.s10,
            champion[teamName].stats.s10,
            combined[teamName].stats.s10,
        );
        if(Object.keys(foundation).includes(teamName)){
            combined[teamName].stats.s10 = Object.assign(
                combined[teamName].stats.s10,
                foundation[teamName].stats.s10
            );
        }
        if(Object.keys(premier).includes(teamName)){
            combined[teamName].stats.s10 = Object.assign(
                combined[teamName].stats.s10,
                premier[teamName].stats.s10
            );
        }
    }
    return combined;
}