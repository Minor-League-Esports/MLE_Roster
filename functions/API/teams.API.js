const sheets = require("../sheets");
const util = require('../util');
exports.getTeamMeta = async () => {
    const DIRECTORY_SHEET = "13yPS53Oe4B97pRsPM9bV4GFvs6b_nZ6KiqPqjCQDb6E";

    console.log("Collecting Team Conference / Division Information");
    let [detailedRoster] = await sheets.sheetValues(DIRECTORY_SHEET, ["Rosters (Detailed)!B95:D127"]);
    let roster_labels = detailedRoster.data.values.splice(0, 1).map(a => a.map(util.clean));
    return detailedRoster.data.values.reduce(async (pP, c) => {
        let [team, p] = await Promise.all([util.coalesce(c, ...roster_labels), pP]);
        p[c[0]] = team;
        return p;
    }, {});
}

exports.getTeamLeadership = async (players) => {
    console.log("Collecting Team Leadership Information");
    let [teamLeadership] = await sheets.sheetValues("14F0bsIXXIE4lFwUALCZUhH0ihWBtxj3HmazZwVnEEFc", ["Franchise Leaders!A1:G33"]);
    let leadership_labels = teamLeadership.data.values.splice(0, 1).map(a => a.map(util.clean));
    leadership_labels[0][0] = "Team"; // Spreadsheet does not contain a header in this spot because... reasons
    return teamLeadership.data.values.reduce(async (pP, c) => {
        let [team, p] = await Promise.all([util.coalesce(c, ...leadership_labels), pP]);
        Object.keys(team).forEach(role => {
            if (role === "Team") return;
            if (!Array.isArray(team[role])) {
                let name = team[role];
                let mleid = util.getMLEIDByName(players, name);
                team[role] = {
                    name,
                    mleid
                }
            } else {
                team[role].forEach((name, i) => {
                    let mleid = util.getMLEIDByName(players, name);
                    team[role][i] = {
                        name,
                        mleid
                    }
                })
            }
        })
        if(!Object.keys(p).includes(team.Team)) p[team.Team] = {};
        p[team.Team].leadership = team;
        return p;
    }, {});
}