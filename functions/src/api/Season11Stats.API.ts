// We do not use coalesce because the structure of this data is different enough to warrant a custom function
import * as sheets from "../helpers/sheets";

function processHomeAwaySheet(data: any) {
    let output: any = {};
    for (let i = 0; i < data[0].length; i += 3) {
        let j = i;
        let matchNum = data[0][j].split(" ")[1];
        let map = data[1][j];
        let days = data[2][j];
        // Collect Metadata
        output[matchNum] = {};
        output[matchNum].map = map;
        output[matchNum].days = days;
        output[matchNum].match = matchNum;
        // Collect Teams
        output[matchNum].matches = [];
        for (let k = 4; k < data.length; k++) {
            output[matchNum].matches.push({
                home: data[k][j + 2],
                away: data[k][j],
            })
        }
    }
    return output;
}

function buildPlayerStat(game: any, current: any) {
    if (!Object.keys(game).includes("players")) game.players = {};

    game.players[current.Series_Game.player_mleid] = {
        data: current.Player_Data,
        meta: current.Player_ID,
        camera: current.Player_Camera,
        stats: {
            core: current.Player_Stats_Core,
            boost: current.Player_Stats_Boost,
            movement: current.Player_Stats_Movement,
            positioning: current.Player_Stats_Positioning,
            demo: current.Player_Stats_Demo
        }
    }
}

function buildTimeMeta(game: any, current: any) {
    if (!Object.keys(game).includes("replay"))
        game.replay = {
            date: current.Series.replay_date,
            time: current.Series.replay_time
        }

    if (!Object.keys(game).includes("created"))
        game.created = {
            date: current.Series.created_date,
            time: current.Series.created_time
        }

    if (!Object.keys(game).includes("submitted"))
        game.submitted = {
            date: current.Series.submission_date,
            time: current.Series.submission_time
        }
}

function buildPlayersList(obj: any, match_id: string, current: any) {
    if (!obj[match_id].players.map((p:any) => p.id).includes(current.Series_Game.player_mleid))
        // Store salary and role for snapshot data
        obj[match_id].players.push({
            id: current.Series_Game.player_mleid,
            salary: current.Series_Game.salary,
            role: current.Series_Game.role
        });
}

function buildBaseMatchObject(obj: any, match_id: string, current: any) {
    if (!Object.keys(obj).includes(match_id)) {
        // Initial appearance for this match
        obj[match_id] = {};
        obj[match_id].meta = {
            league: current.Series.league,
            season: current.Series.season,
            match: current.Series.match,
            series: current.Series.series
        };
        obj[match_id].games = [{}, {}, {}, {}, {}];
        obj[match_id].players = [];
        obj[match_id].teams = [
            current.Series_Game.franchise,
            current.Series_Game.opponent
        ];
    }
}


export async function getHomeAway(){
    const MULTI_TOOL_SHEET = "14F0bsIXXIE4lFwUALCZUhH0ihWBtxj3HmazZwVnEEFc";
    const rawData = (await sheets.sheetValues(MULTI_TOOL_SHEET, ["Fixture Home/Away!A1:AP20"]))[0].values;

    let data = processHomeAwaySheet(rawData);
    return data;
}

export async function getS11Stats(){
    console.log("Getting season 11 stats");
    const STAT_SHEET = "1itEo2kGGJFXviEZiqQMgCXU2EUHFV1KktHNlDQUENjU";

    let statsMeta = (await sheets.sheetMeta(STAT_SHEET, ["RawReplayData"]));
    let statSheetMeta = (statsMeta.sheets ?? [])[0].properties?.gridProperties ?? {};
    let statSheetData = (await sheets.sheetValues(STAT_SHEET, [
        `RawReplayData!A1:${sheets.columnToLetter(statSheetMeta.columnCount ?? 0)}${statSheetMeta.rowCount}`
    ]))[0];

    let statSheetHeaders: string[][] = statSheetData.values?.splice(0, 2).map(ha => ha.map(h => sheets.clean(h))) ?? [];
    let statSheet = statSheetData.values ?? [];
    let promises = [];
    for (let s of statSheet) {
        promises.push(sheets.coalesce(s, ...statSheetHeaders));
    }
    let rawStats = await Promise.all(promises);

    let stats = rawStats.reduce((obj, current) => {
        let match_id = current.Series.match_id;
        let gameNum = parseInt(current.Series_Game.game_num) - 1;

        buildBaseMatchObject(obj, match_id, current);
        buildPlayersList(obj, match_id, current);

        let game = obj[match_id].games[gameNum];

        buildTimeMeta(game, current);
        buildPlayerStat(game, current);

        if(!Object.keys(game).includes("ncp")) game.ncp = current.Series_Game.ncp;
        if(!Object.keys(game).includes("winner")) {
            if(current.Series_Game.win === "TRUE"){
                // Current team won
                game.winner = current.Series_Game.franchise;
            } else {
                // Current team lost
                game.winner = current.Series_Game.opponent;
            }
        }
        if(!Object.keys(game).includes("meta")) game.meta = current.Series_Replay


        if(!Object.keys(game).includes("teams")) game.teams = {};
        if(!Object.keys(game.teams).includes(current.Series_Game.franchise)){
            game.teams[current.Series_Game.franchise] = {
                stats: {
                    core: current.Team_Stats_Core,
                    ball: current.Team_Stats_Ball
                }
            }
        }

        return obj;
    }, {})

    return stats;

}