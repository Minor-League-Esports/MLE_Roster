"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSeason10 = void 0;
const sheets = require("../helpers/sheets");
async function getSeasonStats(data, labels, season, league) {
    return data.reduce(async (pP, c) => {
        const [team, p] = await Promise.all([sheets.coalesce(c, ...labels), pP]);
        if (!p.hasOwnProperty(team.Team))
            p[team.Team] = {};
        if (!p[team.Team].hasOwnProperty("stats"))
            p[team.Team].stats = {};
        if (!p[team.Team].stats.hasOwnProperty("s10"))
            p[team.Team].stats.s10 = {};
        p[team.Team].stats.s10[league] = team;
        return p;
    }, {});
}
async function combineSeasonStats(foundation, academy, champion, premier, combined) {
    for (const teamName in combined) {
        combined[teamName].stats.s10 = Object.assign(academy[teamName].stats.s10, champion[teamName].stats.s10, combined[teamName].stats.s10);
        if (Object.keys(foundation).includes(teamName)) {
            combined[teamName].stats.s10 = Object.assign(combined[teamName].stats.s10, foundation[teamName].stats.s10);
        }
        if (Object.keys(premier).includes(teamName)) {
            combined[teamName].stats.s10 = Object.assign(combined[teamName].stats.s10, premier[teamName].stats.s10);
        }
    }
    return combined;
}
async function getSeason10() {
    var _a, _b, _c, _d, _e;
    console.log("Collecting Season 10 Team Stats");
    const S10Statistics = "1cbKKs1iUHSTDJSzng5KC_56jm-3tjp93w7L-bJ7UuHc";
    const [s10foundation, s10academy, s10champion, s10premier, s10combined] = await sheets.sheetValues(S10Statistics, [
        "Foundation Team Stats!A2:CW19",
        "Academy Team Stats!A2:CW35",
        "Champion Team Stats!A2:CW35",
        "Premier Team Stats!A2:CW35",
        "Combined Team Stats!A2:CZ35",
    ]);
    const foundation_labels = (_a = s10foundation.values) === null || _a === void 0 ? void 0 : _a.splice(0, 2).map(a => a.map(sheets.clean));
    const academy_labels = (_b = s10academy.values) === null || _b === void 0 ? void 0 : _b.splice(0, 2).map(a => a.map(sheets.clean));
    const champion_labels = (_c = s10champion.values) === null || _c === void 0 ? void 0 : _c.splice(0, 2).map(a => a.map(sheets.clean));
    const premier_labels = (_d = s10premier.values) === null || _d === void 0 ? void 0 : _d.splice(0, 2).map(a => a.map(sheets.clean));
    const combined_labels = (_e = s10combined.values) === null || _e === void 0 ? void 0 : _e.splice(0, 2).map(a => a.map(sheets.clean));
    const [foundation, academy, champion, premier, combined] = await Promise.all([
        getSeasonStats(s10foundation.values, foundation_labels !== null && foundation_labels !== void 0 ? foundation_labels : [], "10", "foundation"),
        getSeasonStats(s10academy.values, academy_labels !== null && academy_labels !== void 0 ? academy_labels : [], "10", "academy"),
        getSeasonStats(s10champion.values, champion_labels !== null && champion_labels !== void 0 ? champion_labels : [], "10", "champion"),
        getSeasonStats(s10premier.values, premier_labels !== null && premier_labels !== void 0 ? premier_labels : [], "10", "premier"),
        getSeasonStats(s10combined.values, combined_labels !== null && combined_labels !== void 0 ? combined_labels : [], "10", "combined"),
    ]);
    return await combineSeasonStats(foundation, academy, champion, premier, combined);
}
exports.getSeason10 = getSeason10;
//# sourceMappingURL=Season10Stats.API.js.map