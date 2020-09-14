import * as sheets from "../helpers/sheets"
import * as mleMeta from "../helpers/mleMeta";

export async function getTeamMeta(): Promise<any> {
    const DIRECTORY_SHEET = "13yPS53Oe4B97pRsPM9bV4GFvs6b_nZ6KiqPqjCQDb6E";

    console.log("Collecting Team Conference / Division Information");
    let [detailedRoster] = await sheets.sheetValues(DIRECTORY_SHEET, ["Rosters (Detailed)!B95:D127"]);
    let roster_labels: any[][] = detailedRoster.values?.splice(0, 1).map((a: any[]) => a.map(sheets.clean)) ?? [];
    // @ts-ignore
    return detailedRoster.values?.reduce(async (pP: Promise<any>, c: any) => {
        let [team, p] = await Promise.all([sheets.coalesce(c, ...roster_labels), pP]);
        p[c[0]] = team;
        return p;
    }, {}) ?? {};
}

export async function getTeamLeadership(players: any[]): Promise<any> {
    console.log("Collecting Team Leadership Information");

    let [teamLeadership] = await sheets.sheetValues("14F0bsIXXIE4lFwUALCZUhH0ihWBtxj3HmazZwVnEEFc", ["Franchise Leaders!A1:G33"]);
    let leadership_labels = teamLeadership.values?.splice(0, 1).map((a: any[]) => a.map(sheets.clean)) ?? [[]];
    leadership_labels[0][0] = "Team"; // Spreadsheet does not contain a header in this spot because... reasons
    // @ts-ignore
    return teamLeadership.values?.reduce(async (pP: Promise<any>, c: any) => {
        let [team, p] = await Promise.all([sheets.coalesce(c, ...leadership_labels), pP]);
        Object.keys(team).forEach(role => {
            if (role === "Team") return;
            if (!Array.isArray(team[role])) {
                let name = team[role];
                let mleid = mleMeta.getMLEIDByName(players, name);
                team[role] = {
                    name,
                    mleid
                }
            } else {
                team[role].forEach((name: string, i: number) => {
                    let mleid = mleMeta.getMLEIDByName(players, name);
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
    }, {}) ?? {};
}