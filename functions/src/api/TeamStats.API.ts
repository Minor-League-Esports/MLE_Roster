import * as sheets from "../helpers/sheets";
import {attachColumnOrdinals} from "../helpers/sheets";

async function getSeasonStats(data: any, labels: string[][], season: string, league: string) {
    if(labels[1][0] === "Teams") labels[1][0] = "Team"; // TODO: Unhackify this
    return data.reduce((p: any, c: any) => {
        const team = attachColumnOrdinals(sheets.coalesce(c, ...labels));
        if (!p.hasOwnProperty(team.Team)) p[team.Team] = {};
        if (!p[team.Team].hasOwnProperty("stats")) p[team.Team].stats = {};
        if (!p[team.Team].stats.hasOwnProperty(season)) p[team.Team].stats[season] = {};
        p[team.Team].stats[season][league] = team;
        return p;
    }, {});
}

async function combineSeasonStats(foundation: any, academy: any, champion: any, master: any, premier: any, combined: any, season: string) {
    for (const teamName in combined) {
        combined[teamName].stats[season] = Object.assign(
            academy[teamName].stats[season],
            champion[teamName].stats[season],
            combined[teamName].stats[season],
        );
        if (Object.keys(foundation).includes(teamName)) {
            combined[teamName].stats[season] = Object.assign(
                combined[teamName].stats[season],
                foundation[teamName].stats[season]
            );
        }
        if(Object.keys(master).includes(teamName)){
            combined[teamName].stats[season] = Object.assign(
                combined[teamName].stats[season],
                master[teamName].stats[season]
            );
        }
        if (Object.keys(premier).includes(teamName)) {
            combined[teamName].stats[season] = Object.assign(
                combined[teamName].stats[season],
                premier[teamName].stats[season]
            );
        }
    }
    return combined;
}

async function getSeason(sheetId: string, seasonNum: string, includeMaster:boolean = false) {
    const [foundation, academy, champion, premier, combined] = await sheets.sheetValues(sheetId, [
            "Foundation Team Stats!A2:CW19",
            "Academy Team Stats!A2:CW35",
            "Champion Team Stats!A2:CW35",
            "Premier Team Stats!A2:CW35",
            "Combined Team Stats!A2:CZ35",
        ]);

    const foundation_labels = foundation.values?.splice(0, 2).map(a => a.map(sheets.clean));
    const academy_labels = academy.values?.splice(0, 2).map(a => a.map(sheets.clean));
    const champion_labels = champion.values?.splice(0, 2).map(a => a.map(sheets.clean));
    const premier_labels = premier.values?.splice(0, 2).map(a => a.map(sheets.clean));
    const combined_labels = combined.values?.splice(0, 2).map(a => a.map(sheets.clean));

    const [foundation_data, academy_data, champion_data, premier_data, combined_data] = await Promise.all([
        getSeasonStats(foundation.values, foundation_labels ?? [], seasonNum, "foundation"),
        getSeasonStats(academy.values, academy_labels ?? [], seasonNum, "academy"),
        getSeasonStats(champion.values, champion_labels ?? [], seasonNum, "champion"),
        getSeasonStats(premier.values, premier_labels ?? [], seasonNum, "premier"),
        getSeasonStats(combined.values, combined_labels ?? [], seasonNum, "combined"),
    ])
    if(includeMaster){
        const [master] = await sheets.sheetValues(sheetId, ["Master Team Stats!A2:CZ35"]);
        const master_labels = master.values?.splice(0, 2).map(a => a.map(sheets.clean));
        const master_data = await getSeasonStats(master.values, master_labels ?? [], seasonNum, "master");
        return combineSeasonStats(foundation_data, academy_data, champion_data, master_data, premier_data, combined_data, seasonNum);
    } else {
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

export async function getStats(){
    // @ts-ignore
    const [s10, s11] = await Promise.all([getSeason10(), getSeason11()]);
    // TODO: Wait for somebody to tell me if changing TEAMS to TEAM is going to break shit
    const output: any = {};

    Object.entries(s11).forEach(([team, data]: [string, any]) => {
        output[team] = {};
        output[team].stats = {};
        output[team].stats.s11 = data.stats.s11;
        output[team].stats.s10 = s10[team].stats.s10;
    })
    return output;

}