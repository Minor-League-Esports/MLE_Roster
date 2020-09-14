import * as sheets from "../helpers/sheets";

async function getSeasonStats(data: any, labels: string[][], season: string, league: string) {
    return data.reduce(async (pP: Promise<any>, c: any) => {
        const [team, p] = await Promise.all([sheets.coalesce(c, ...labels), pP]);
        if (!p.hasOwnProperty(team.Team)) p[team.Team] = {};
        if (!p[team.Team].hasOwnProperty("stats")) p[team.Team].stats = {};
        if (!p[team.Team].stats.hasOwnProperty("s10")) p[team.Team].stats.s10 = {};
        p[team.Team].stats.s10[league] = team;
        return p;
    }, {});
}

async function combineSeasonStats(foundation: any, academy: any, champion: any, premier: any, combined: any) {
    for (const teamName in combined) {
        combined[teamName].stats.s10 = Object.assign(
            academy[teamName].stats.s10,
            champion[teamName].stats.s10,
            combined[teamName].stats.s10,
        );
        if (Object.keys(foundation).includes(teamName)) {
            combined[teamName].stats.s10 = Object.assign(
                combined[teamName].stats.s10,
                foundation[teamName].stats.s10
            );
        }
        if (Object.keys(premier).includes(teamName)) {
            combined[teamName].stats.s10 = Object.assign(
                combined[teamName].stats.s10,
                premier[teamName].stats.s10
            );
        }
    }
    return combined;
}

export async function getSeason10() {
    console.log("Collecting Season 10 Team Stats");
    const S10Statistics = "1cbKKs1iUHSTDJSzng5KC_56jm-3tjp93w7L-bJ7UuHc";
    const [s10foundation, s10academy, s10champion, s10premier, s10combined] = await sheets.sheetValues(S10Statistics, [
            "Foundation Team Stats!A2:CW19",
            "Academy Team Stats!A2:CW35",
            "Champion Team Stats!A2:CW35",
            "Premier Team Stats!A2:CW35",
            "Combined Team Stats!A2:CZ35",
        ]
    );

    const foundation_labels = s10foundation.values?.splice(0, 2).map(a => a.map(sheets.clean));
    const academy_labels = s10academy.values?.splice(0, 2).map(a => a.map(sheets.clean));
    const champion_labels = s10champion.values?.splice(0, 2).map(a => a.map(sheets.clean));
    const premier_labels = s10premier.values?.splice(0, 2).map(a => a.map(sheets.clean));
    const combined_labels = s10combined.values?.splice(0, 2).map(a => a.map(sheets.clean));

    const [foundation, academy, champion, premier, combined] = await Promise.all([
        getSeasonStats(s10foundation.values, foundation_labels ?? [], "10", "foundation"),
        getSeasonStats(s10academy.values, academy_labels ?? [], "10", "academy"),
        getSeasonStats(s10champion.values, champion_labels ?? [], "10", "champion"),
        getSeasonStats(s10premier.values, premier_labels ?? [], "10", "premier"),
        getSeasonStats(s10combined.values, combined_labels ?? [],  "10", "combined"),
    ])
    return combineSeasonStats(foundation, academy, champion, premier, combined);

}