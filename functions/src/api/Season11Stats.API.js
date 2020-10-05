"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getS11Stats = exports.getHomeAway = void 0;
// We do not use coalesce because the structure of this data is different enough to warrant a custom function
const sheets = require("../helpers/sheets");
function processHomeAwaySheet(data) {
    const output = {};
    for (let i = 0; i < data[0].length; i += 3) {
        const j = i;
        const matchNum = data[0][j].split(" ")[1];
        const map = data[1][j];
        const days = data[2][j];
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
                matchNum: k - 3
            });
        }
    }
    return output;
}
function buildPlayerStat(game, current) {
    if (!Object.keys(game).includes("players"))
        game.players = {};
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
    };
}
function buildTimeMeta(game, current) {
    if (!Object.keys(game).includes("replay"))
        game.replay = {
            date: current.Series.replay_date,
            time: current.Series.replay_time
        };
    if (!Object.keys(game).includes("created"))
        game.created = {
            date: current.Series.created_date,
            time: current.Series.created_time
        };
    if (!Object.keys(game).includes("submitted"))
        game.submitted = {
            date: current.Series.submission_date,
            time: current.Series.submission_time
        };
}
function buildPlayersList(obj, match_id, current) {
    if (!obj[match_id].players.map((p) => p.id).includes(current.Series_Game.player_mleid))
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
async function getHomeAway() {
    const MULTI_TOOL_SHEET = "14F0bsIXXIE4lFwUALCZUhH0ihWBtxj3HmazZwVnEEFc";
    const rawData = (await sheets.sheetValues(MULTI_TOOL_SHEET, ["Fixture Home/Away!A1:AP20"]))[0].values;
    const data = processHomeAwaySheet(rawData);
    return data;
}
exports.getHomeAway = getHomeAway;
async function getS11Stats() {
    var _a, _b, _c, _d, _e, _f, _g;
    console.log("Getting season 11 stats");
    const STAT_SHEET = "1itEo2kGGJFXviEZiqQMgCXU2EUHFV1KktHNlDQUENjU";
    const statsMeta = (await sheets.sheetMeta(STAT_SHEET, ["RawReplayData"]));
    const statSheetMeta = (_c = (_b = ((_a = statsMeta.sheets) !== null && _a !== void 0 ? _a : [])[0].properties) === null || _b === void 0 ? void 0 : _b.gridProperties) !== null && _c !== void 0 ? _c : {};
    const statSheetData = (await sheets.sheetValues(STAT_SHEET, [
        `RawReplayData!A1:${sheets.columnToLetter((_d = statSheetMeta.columnCount) !== null && _d !== void 0 ? _d : 0)}${statSheetMeta.rowCount}`
    ]))[0];
    const statSheetHeaders = (_f = (_e = statSheetData.values) === null || _e === void 0 ? void 0 : _e.splice(0, 2).map(ha => ha.map(h => sheets.clean(h)))) !== null && _f !== void 0 ? _f : [];
    const statSheet = (_g = statSheetData.values) !== null && _g !== void 0 ? _g : [];
    const rawStats = statSheet.map(s => sheets.coalesce(s, ...statSheetHeaders));
    const stats = rawStats.reduce((obj, current) => {
        const match_id = current.Series.match_id;
        const gameNum = parseInt(current.Series_Game.game_num) - 1;
        buildBaseMatchObject(obj, match_id, current);
        buildPlayersList(obj, match_id, current);
        const game = obj[match_id].games[gameNum];
        buildTimeMeta(game, current);
        buildPlayerStat(game, current);
        if (!Object.keys(game).includes("ncp"))
            game.ncp = current.Series_Game.ncp;
        if (!Object.keys(game).includes("winner")) {
            if (current.Series_Game.win === "TRUE") {
                // Current team won
                game.winner = current.Series_Game.franchise;
            }
            else {
                // Current team lost
                game.winner = current.Series_Game.opponent;
            }
        }
        if (!Object.keys(game).includes("meta"))
            game.meta = current.Series_Replay;
        if (!Object.keys(game).includes("teams"))
            game.teams = {};
        if (!Object.keys(game.teams).includes(current.Series_Game.franchise)) {
            game.teams[current.Series_Game.franchise] = {
                stats: {
                    core: current.Team_Stats_Core,
                    ball: current.Team_Stats_Ball
                }
            };
        }
        return obj;
    }, {});
    return stats;
}
exports.getS11Stats = getS11Stats;
//# sourceMappingURL=Season11Stats.API.js.map