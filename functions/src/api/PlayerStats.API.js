"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStats = void 0;
const sheets = require("../helpers/sheets");
async function getStats() {
    var _a, _b, _c, _d, _e, _f;
    const playerSheetId = "1hrWaUm4T_3cajBxMoLuAVOrLxgEX1fLmKrGznyj8UNE";
    const playerStatAllMeta = await sheets.sheetMeta(playerSheetId, ["Player Stats"]);
    const playerStatMeta = (_b = ((_a = playerStatAllMeta.sheets) !== null && _a !== void 0 ? _a : [])[0].properties) === null || _b === void 0 ? void 0 : _b.gridProperties;
    if (typeof playerStatMeta === "undefined" || !playerStatMeta.columnCount || !playerStatMeta.frozenRowCount) {
        throw new Error("Player Stat Sheet Metadata is undefined!");
    }
    const [playerStatSheet] = await sheets.sheetValues(playerSheetId, [
        `Player Stats!A2:${sheets.columnToLetter(playerStatMeta.columnCount)}${(_c = playerStatMeta.rowCount) !== null && _c !== void 0 ? _c : 2 + 1}` // Start at A2 because A1 just says "MLE"
    ]);
    const playerStatHeaders = (_e = (_d = playerStatSheet.values) === null || _d === void 0 ? void 0 : _d.splice(0, playerStatMeta.frozenRowCount - 1).map(ha => ha.map(h => sheets.clean(h)))) !== null && _e !== void 0 ? _e : [];
    const playerStatData = (_f = playerStatSheet.values) !== null && _f !== void 0 ? _f : [];
    const rawStats = playerStatData.map(s => sheets.coalesce(s, ...playerStatHeaders));
    const stats = rawStats.reduce((r, c) => {
        r[c.MLEID] = sheets.attachColumnOrdinals(c);
        return r;
    }, {});
    return stats;
}
exports.getStats = getStats;
//# sourceMappingURL=PlayerStats.API.js.map