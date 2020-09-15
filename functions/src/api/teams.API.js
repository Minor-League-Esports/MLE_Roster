"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTeamLeadership = exports.getTeamMeta = void 0;
const sheets = require("../helpers/sheets");
const mleMeta = require("../helpers/mleMeta");
async function getTeamMeta() {
    var _a, _b, _c, _d;
    const DIRECTORY_SHEET = "13yPS53Oe4B97pRsPM9bV4GFvs6b_nZ6KiqPqjCQDb6E";
    console.log("Collecting Team Conference / Division Information");
    const [detailedRoster] = await sheets.sheetValues(DIRECTORY_SHEET, ["Rosters (Detailed)!B95:D127"]);
    const roster_labels = (_b = (_a = detailedRoster.values) === null || _a === void 0 ? void 0 : _a.splice(0, 1).map((a) => a.map(sheets.clean))) !== null && _b !== void 0 ? _b : [];
    // @ts-ignore
    return (_d = (_c = detailedRoster.values) === null || _c === void 0 ? void 0 : _c.reduce(async (pP, c) => {
        const [team, p] = await Promise.all([sheets.coalesce(c, ...roster_labels), pP]);
        p[c[0]] = team;
        return p;
    }, {})) !== null && _d !== void 0 ? _d : {};
}
exports.getTeamMeta = getTeamMeta;
async function getTeamLeadership(players) {
    var _a, _b, _c, _d;
    console.log("Collecting Team Leadership Information");
    const [teamLeadership] = await sheets.sheetValues("14F0bsIXXIE4lFwUALCZUhH0ihWBtxj3HmazZwVnEEFc", ["Franchise Leaders!A1:G33"]);
    const leadership_labels = (_b = (_a = teamLeadership.values) === null || _a === void 0 ? void 0 : _a.splice(0, 1).map((a) => a.map(sheets.clean))) !== null && _b !== void 0 ? _b : [[]];
    leadership_labels[0][0] = "Team"; // Spreadsheet does not contain a header in this spot because... reasons
    // @ts-ignore
    return (_d = (_c = teamLeadership.values) === null || _c === void 0 ? void 0 : _c.reduce(async (pP, c) => {
        const [team, p] = await Promise.all([sheets.coalesce(c, ...leadership_labels), pP]);
        Object.keys(team).forEach(role => {
            if (role === "Team")
                return;
            if (!Array.isArray(team[role])) {
                const name = team[role];
                const mleid = mleMeta.getMLEIDByName(players, name);
                team[role] = {
                    name,
                    mleid
                };
            }
            else {
                team[role].forEach((name, i) => {
                    const mleid = mleMeta.getMLEIDByName(players, name);
                    team[role][i] = {
                        name,
                        mleid
                    };
                });
            }
        });
        if (!Object.keys(p).includes(team.Team))
            p[team.Team] = {};
        p[team.Team].leadership = team;
        return p;
    }, {})) !== null && _d !== void 0 ? _d : {};
}
exports.getTeamLeadership = getTeamLeadership;
//# sourceMappingURL=teams.API.js.map