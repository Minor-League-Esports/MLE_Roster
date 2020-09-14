const sheets = require("../sheets");
const util = require("../util");

function buildPlayerStat(game, current) {
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

function buildTimeMeta(game, current) {
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

function buildPlayersList(obj, match_id, current) {
    if (!obj[match_id].players.map(p => p.id).includes(current.Series_Game.player_mleid))
        // Store salary and role for snapshot data
        obj[match_id].players.push({
            id: current.Series_Game.player_mleid,
            salary: current.Series_Game.salary,
            role: current.Series_Game.role
        });
}

function buildBaseMatchObject(obj, match_id, current) {
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

exports.getS11Stats = async () => {
    console.log("Getting season 11 stats");
    const STAT_SHEET = "1itEo2kGGJFXviEZiqQMgCXU2EUHFV1KktHNlDQUENjU";

    let statSheetMeta = (await sheets.sheetMeta(STAT_SHEET, ["RawReplayData"])).data.sheets[0].properties.gridProperties;
    let statSheetData = (await sheets.sheetValues(STAT_SHEET, [
        `RawReplayData!A1:${util.columnToLetter(statSheetMeta.columnCount)}${statSheetMeta.rowCount}`
    ]))[0];

    let statSheetHeaders = statSheetData.data.values.splice(0, 2).map(ha => ha.map(h => util.clean(h)));
    let statSheet = statSheetData.data.values;
    let promises = [];
    for (let s of statSheet) {
        promises.push(util.coalesce(s, ...statSheetHeaders));
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