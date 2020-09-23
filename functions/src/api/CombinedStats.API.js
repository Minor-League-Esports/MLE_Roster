"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStats = void 0;
const sheets = require("../helpers/sheets");
async function getSeasonStats(data, labels, season, league) {
    if (labels[1][0] === "Teams")
        labels[1][0] = "Team"; // TODO: Unhackify this
    return data.reduce(async (pP, c) => {
        const [team, p] = await Promise.all([sheets.coalesce(c, ...labels), pP]);
        if (!p.hasOwnProperty(team.Team))
            p[team.Team] = {};
        if (!p[team.Team].hasOwnProperty("stats"))
            p[team.Team].stats = {};
        if (!p[team.Team].stats.hasOwnProperty(season))
            p[team.Team].stats[season] = {};
        p[team.Team].stats[season][league] = team;
        return p;
    }, {});
}
async function combineSeasonStats(foundation, academy, champion, master, premier, combined, season) {
    for (const teamName in combined) {
        combined[teamName].stats[season] = Object.assign(academy[teamName].stats[season], champion[teamName].stats[season], combined[teamName].stats[season]);
        if (Object.keys(foundation).includes(teamName)) {
            combined[teamName].stats[season] = Object.assign(combined[teamName].stats[season], foundation[teamName].stats[season]);
        }
        if (Object.keys(master).includes(teamName)) {
            combined[teamName].stats[season] = Object.assign(combined[teamName].stats[season], master[teamName].stats[season]);
        }
        if (Object.keys(premier).includes(teamName)) {
            combined[teamName].stats[season] = Object.assign(combined[teamName].stats[season], premier[teamName].stats[season]);
        }
    }
    return combined;
}
async function getSeason(sheetId, seasonNum, includeMaster = false) {
    var _a, _b, _c, _d, _e, _f;
    const [foundation, academy, champion, premier, combined] = await sheets.sheetValues(sheetId, [
        "Foundation Team Stats!A2:CW19",
        "Academy Team Stats!A2:CW35",
        "Champion Team Stats!A2:CW35",
        "Premier Team Stats!A2:CW35",
        "Combined Team Stats!A2:CZ35",
    ]);
    const foundation_labels = (_a = foundation.values) === null || _a === void 0 ? void 0 : _a.splice(0, 2).map(a => a.map(sheets.clean));
    const academy_labels = (_b = academy.values) === null || _b === void 0 ? void 0 : _b.splice(0, 2).map(a => a.map(sheets.clean));
    const champion_labels = (_c = champion.values) === null || _c === void 0 ? void 0 : _c.splice(0, 2).map(a => a.map(sheets.clean));
    const premier_labels = (_d = premier.values) === null || _d === void 0 ? void 0 : _d.splice(0, 2).map(a => a.map(sheets.clean));
    const combined_labels = (_e = combined.values) === null || _e === void 0 ? void 0 : _e.splice(0, 2).map(a => a.map(sheets.clean));
    const [foundation_data, academy_data, champion_data, premier_data, combined_data] = await Promise.all([
        getSeasonStats(foundation.values, foundation_labels !== null && foundation_labels !== void 0 ? foundation_labels : [], seasonNum, "foundation"),
        getSeasonStats(academy.values, academy_labels !== null && academy_labels !== void 0 ? academy_labels : [], seasonNum, "academy"),
        getSeasonStats(champion.values, champion_labels !== null && champion_labels !== void 0 ? champion_labels : [], seasonNum, "champion"),
        getSeasonStats(premier.values, premier_labels !== null && premier_labels !== void 0 ? premier_labels : [], seasonNum, "premier"),
        getSeasonStats(combined.values, combined_labels !== null && combined_labels !== void 0 ? combined_labels : [], seasonNum, "combined"),
    ]);
    if (includeMaster) {
        const [master] = await sheets.sheetValues(sheetId, ["Master Team Stats!A2:CZ35"]);
        const master_labels = (_f = master.values) === null || _f === void 0 ? void 0 : _f.splice(0, 2).map(a => a.map(sheets.clean));
        const master_data = await getSeasonStats(master.values, master_labels !== null && master_labels !== void 0 ? master_labels : [], seasonNum, "master");
        return combineSeasonStats(foundation_data, academy_data, champion_data, master_data, premier_data, combined_data, seasonNum);
    }
    else {
        return combineSeasonStats(foundation_data, academy_data, champion_data, {}, premier_data, combined_data, seasonNum);
    }
}
async function getSeason11() {
    console.log("Collecting Season 11 Team Stats");
    const S11Statistics = "1YIuj_ER4Kd3CZFUAFbGwlTJqDoGY_t27XSw2ir0UxnA";
    return await getSeason(S11Statistics, "s11", true);
}
async function getSeason10() {
    console.log("Collecting Season 10 Team Stats");
    const S10Statistics = "1cbKKs1iUHSTDJSzng5KC_56jm-3tjp93w7L-bJ7UuHc";
    return await getSeason(S10Statistics, "s10");
}
async function getStats() {
    // @ts-ignore
    const [s10, s11] = await Promise.all([getSeason10(), getSeason11()]);
    // TODO: Wait for somebody to tell me if changing TEAMS to TEAM is going to break shit
    const output = {};
    Object.entries(s11).forEach(([team, data]) => {
        output[team] = {};
        output[team].stats = {};
        output[team].stats.s11 = data.stats.s11;
        output[team].stats.s10 = s10[team].stats.s10;
    });
    return output;
}
exports.getStats = getStats;
//# sourceMappingURL=CombinedStats.API.js.map