"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clean = exports.asyncReductionFactory = exports.coalesce = exports.letterToColumn = exports.columnToLetter = exports.sheetValues = exports.sheetMeta = void 0;
const googleapis_1 = require("googleapis");
const functions = require("firebase-functions");
const sheets = googleapis_1.google.sheets({
    version: 'v4',
    auth: functions.config().google.sheet_api_key
});
async function sheetMeta(spreadsheetId, ranges) {
    return (await sheets.spreadsheets.get({
        spreadsheetId, ranges
    })).data;
}
exports.sheetMeta = sheetMeta;
async function sheetValues(spreadsheetId, ranges) {
    const promises = [];
    ranges.forEach(range => {
        promises.push(sheets.spreadsheets.values.get({
            spreadsheetId,
            majorDimension: "rows",
            range
        }));
    });
    return (await Promise.all(promises)).map(d => d.data);
}
exports.sheetValues = sheetValues;
/**
 * Map a column number to a spreadsheet designation
 * i.e. 0 => A, 1 => B
 * @param column
 * @returns {string}
 */
function columnToLetter(column) {
    let temp, letter = '', c = column;
    while (c > 0) {
        temp = (c - 1) % 26;
        letter = String.fromCharCode(temp + 65) + letter;
        c = (c - temp - 1) / 26;
    }
    return letter;
}
exports.columnToLetter = columnToLetter;
/**
 * Map a spreadsheet column to a number
 * i.e. A => 0, B => 1
 * @param letter
 * @returns {number}
 */
function letterToColumn(letter) {
    let column = 0;
    const length = letter.length;
    for (let i = 0; i < length; i++) {
        column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1);
    }
    return column;
}
exports.letterToColumn = letterToColumn;
const setValue = (ref, currentLevel, val) => {
    if (ref.hasOwnProperty(currentLevel)) {
        const temp = ref[currentLevel];
        if (Array.isArray(ref[currentLevel])) {
            ref[currentLevel].push(val);
        }
        else {
            ref[currentLevel] = [temp, val];
        }
    }
    else {
        ref[currentLevel] = val;
    }
};
/**
 * Map an array of values to an array of object paths
 * @param data  {Array}
 * @param levels {String[]}
 * @returns {{}}
 */
async function coalesce(data, ...levels) {
    if (!data)
        return {};
    const output = {};
    const longest = Math.max(...levels.map(l => l.length));
    levels.forEach(level => {
        while (level.length < longest)
            level.push("");
    });
    let lastLevels = Array(levels.length);
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < lastLevels.length; j++) {
            if (levels[j][i] !== "") {
                lastLevels[j] = levels[j][i];
                lastLevels = [...lastLevels.slice(0, j + 1), ...lastLevels.slice(j + 1).map(() => "")];
            }
        }
        let ref = output;
        for (let j = 0; j < lastLevels.length; j++) {
            let currentLevel = lastLevels[j];
            if (typeof lastLevels[j] === "undefined") {
                j++;
                currentLevel = lastLevels[j];
            }
            if (j + 1 < lastLevels.length) {
                // Can go deeper
                if (lastLevels.slice(j + 1).every(l => l === "" || typeof l === "undefined")) {
                    // Done, set
                    setValue(ref, currentLevel, data[i]);
                    break;
                }
                else {
                    // Continue
                    if (currentLevel === "")
                        continue;
                    if (!ref[currentLevel])
                        ref[currentLevel] = {};
                    ref = ref[currentLevel];
                }
            }
            else {
                // Last level, set no matter what.
                setValue(ref, currentLevel, data[i]);
                break;
            }
        }
    }
    return output;
}
exports.coalesce = coalesce;
function asyncReductionFactory(groups) {
    return async (pP, c) => {
        const p = await pP;
        p[c[0]] = await coalesce(c, ...groups);
        return p;
    };
}
exports.asyncReductionFactory = asyncReductionFactory;
function clean(label) {
    let output = label;
    if (output.startsWith("vs."))
        output = output.substring(3);
    while (output.startsWith(" "))
        output = output.substring(1);
    output = output.split(" ").join("_");
    output = output.split("-").join("_");
    return output;
}
exports.clean = clean;
//# sourceMappingURL=sheets.js.map