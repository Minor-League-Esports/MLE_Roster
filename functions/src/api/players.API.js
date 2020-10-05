"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReferenceData = exports.getPlayerDirectory = void 0;
const sheets = require("../helpers/sheets");
const SheetModels_1 = require("../models/SheetModels");
async function getPlayerDirectory() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
    console.log("Getting Player Directory Information");
    const DIRECTORY_SHEET = "13yPS53Oe4B97pRsPM9bV4GFvs6b_nZ6KiqPqjCQDb6E";
    const sheetMetadata = await sheets.sheetMeta(DIRECTORY_SHEET, ["Player Directory", "Games Played", "Ineligible List"]);
    if (!sheetMetadata)
        throw new Error("Player directory came back null!");
    if (!sheetMetadata.sheets || sheetMetadata.sheets.length !== 3)
        throw new Error("Player directory missing sheets!");
    const directoryMeta = (_b = (_a = sheetMetadata === null || sheetMetadata === void 0 ? void 0 : sheetMetadata.sheets[0]) === null || _a === void 0 ? void 0 : _a.properties) === null || _b === void 0 ? void 0 : _b.gridProperties;
    const gamesMeta = (_d = (_c = sheetMetadata === null || sheetMetadata === void 0 ? void 0 : sheetMetadata.sheets[1]) === null || _c === void 0 ? void 0 : _c.properties) === null || _d === void 0 ? void 0 : _d.gridProperties;
    const ineligibleMeta = (_f = (_e = sheetMetadata === null || sheetMetadata === void 0 ? void 0 : sheetMetadata.sheets[2]) === null || _e === void 0 ? void 0 : _e.properties) === null || _f === void 0 ? void 0 : _f.gridProperties;
    const [directoryValues, gamesValues, ineligibleValues] = await sheets.sheetValues(DIRECTORY_SHEET, [
        `Player Directory!A1:${sheets.columnToLetter((_g = directoryMeta === null || directoryMeta === void 0 ? void 0 : directoryMeta.columnCount) !== null && _g !== void 0 ? _g : 0)}${(_h = directoryMeta === null || directoryMeta === void 0 ? void 0 : directoryMeta.rowCount) !== null && _h !== void 0 ? _h : 1}`,
        `Games Played!A1:${sheets.columnToLetter((_j = gamesMeta === null || gamesMeta === void 0 ? void 0 : gamesMeta.columnCount) !== null && _j !== void 0 ? _j : 0)}${(_k = gamesMeta === null || gamesMeta === void 0 ? void 0 : gamesMeta.rowCount) !== null && _k !== void 0 ? _k : 1}`,
        `Ineligible List!A4:A${(_l = ineligibleMeta === null || ineligibleMeta === void 0 ? void 0 : ineligibleMeta.rowCount) !== null && _l !== void 0 ? _l : 1}`
    ]);
    if (!directoryValues || !directoryValues.values)
        throw new Error("Missing player directory values!");
    if (!gamesValues || !gamesValues.values)
        throw new Error("Missing games played values!");
    if (!ineligibleValues || !ineligibleValues.values)
        throw new Error("Missing ineligibility values");
    const directoryHeaders = [
        (_m = directoryValues.values[0]) === null || _m === void 0 ? void 0 : _m.map(v => v.split(" ")[0]),
        (_o = directoryValues.values[1]) === null || _o === void 0 ? void 0 : _o.map(v => v.split(" ").join("_"))
    ];
    const directoryData = (_p = directoryValues.values) === null || _p === void 0 ? void 0 : _p.splice(2);
    const gamesHeaders = ((_q = gamesValues.values) !== null && _q !== void 0 ? _q : []).splice(0, 3).map((vs) => vs.map(v => v.split(" ").join("_").replace(/[^a-zA-Z0-9_]/g, "")));
    const gamesData = (_r = gamesValues.values) !== null && _r !== void 0 ? _r : [];
    const ineligibleHeaders = ((_s = ineligibleValues.values) !== null && _s !== void 0 ? _s : []).splice(0, 3).map((vs) => vs.map(v => v.split(" ").join("_").replace(/[^a-zA-Z0-9_]/g, "")));
    const directory = new SheetModels_1.Sheet(directoryHeaders, directoryData);
    const games = new SheetModels_1.Sheet(gamesHeaders, gamesData);
    const ineligible = new SheetModels_1.Sheet(ineligibleHeaders, (_t = ineligibleValues.values) !== null && _t !== void 0 ? _t : []);
    // Ignoring overload because the reduce function does not need the additional parameters to function.
    return [
        // @ts-ignore
        directory.data.reduce(sheets.reductionFactory(directory.headers), {}),
        // @ts-ignore
        games.data.reduce(sheets.reductionFactory(games.headers), {}),
        // @ts-ignore
        ineligible.data.reduce(sheets.reductionFactory(ineligible.headers), {}),
    ];
}
exports.getPlayerDirectory = getPlayerDirectory;
async function getReferenceData() {
    var _a, _b, _c, _d;
    console.log("Getting Reference Helper Data...");
    const REFERENCE_SHEET = "1fOSdkuXaITkkf09ePIK8QnEs4K1KZ0eUJRhZCgyY1VY";
    const referenceMeta = await sheets.sheetMeta(REFERENCE_SHEET, ["MLEIDs", "Current Ranks"]);
    if (!referenceMeta || !referenceMeta.sheets || referenceMeta.sheets.length !== 2)
        throw new Error("Reference Helper Data is incorrect");
    // Get MetaData
    const mleIdsMeta = (_b = (_a = referenceMeta === null || referenceMeta === void 0 ? void 0 : referenceMeta.sheets[0]) === null || _a === void 0 ? void 0 : _a.properties) === null || _b === void 0 ? void 0 : _b.gridProperties;
    const ranksMeta = (_d = (_c = referenceMeta === null || referenceMeta === void 0 ? void 0 : referenceMeta.sheets[1]) === null || _c === void 0 ? void 0 : _c.properties) === null || _d === void 0 ? void 0 : _d.gridProperties;
    // Get Values
    const [mleids, currentRanks] = await sheets.sheetValues(REFERENCE_SHEET, [
        `MLEIDs!A1:C${mleIdsMeta === null || mleIdsMeta === void 0 ? void 0 : mleIdsMeta.rowCount}`,
        `Current Ranks!A1:I${ranksMeta === null || ranksMeta === void 0 ? void 0 : ranksMeta.rowCount}`
    ]);
    if (!mleids.values || !currentRanks.values)
        throw new Error("Refernece helper data values are missing!");
    // Get Headers
    const mleid_labels = mleids.values.splice(0, 1).map(a => a.map(v => v.split(" ").join("_")));
    const currentRank_labels = currentRanks.values.splice(0, 1).map(a => a.map(v => v.split(" ").join("_")));
    return Promise.all([
        // @ts-ignore
        mleids.values.reduce(sheets.asyncReductionFactory(mleid_labels), {}),
        // @ts-ignore
        currentRanks.values.reduce((p, c) => {
            const obj = sheets.coalesce(c, ...currentRank_labels);
            if (!Object.keys(p).includes(c[0]))
                p[c[0]] = {};
            p[c[0]][obj["Tracker_ID"]] = obj;
            return p;
        }, {})
    ]);
}
exports.getReferenceData = getReferenceData;
//# sourceMappingURL=players.API.js.map