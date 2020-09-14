import {google, sheets_v4} from "googleapis";
import * as functions from "firebase-functions";

const sheets = google.sheets({
    version: 'v4',
    auth: functions.config().google.sheet_api_key
});

export async function sheetMeta(spreadsheetId: string, ranges: string[]): Promise<sheets_v4.Schema$Spreadsheet> {
    return (await sheets.spreadsheets.get({
        spreadsheetId, ranges
    })).data;
}

export async function sheetValues(spreadsheetId: string, ranges: string[]): Promise<sheets_v4.Schema$ValueRange[]> {
    const promises: Promise<any>[] = [];
    ranges.forEach(range => {
        promises.push(
            sheets.spreadsheets.values.get({
                spreadsheetId,
                majorDimension: "rows",
                range
            })
        )
    })
    return (await Promise.all(promises)).map(d => d.data);
}

/**
 * Map a column number to a spreadsheet designation
 * i.e. 0 => A, 1 => B
 * @param column
 * @returns {string}
 */
export function columnToLetter(column: number): string {
    let temp, letter = '', c = column;
    while (c > 0) {
        temp = (c - 1) % 26;
        letter = String.fromCharCode(temp + 65) + letter;
        c = (c - temp - 1) / 26;
    }
    return letter;
}

/**
 * Map a spreadsheet column to a number
 * i.e. A => 0, B => 1
 * @param letter
 * @returns {number}
 */
export function letterToColumn(letter: string): number {
    let column = 0;
    const length = letter.length;
    for (let i = 0; i < length; i++) {
        column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1);
    }
    return column;
}


const setValue = (ref: any, currentLevel: string, val: any) => {
    if (ref.hasOwnProperty(currentLevel)) {
        let temp = ref[currentLevel];
        if (Array.isArray(ref[currentLevel])) {
            ref[currentLevel].push(val);
        } else {
            ref[currentLevel] = [temp, val];
        }
    } else {
        ref[currentLevel] = val;
    }
}

/**
 * Map an array of values to an array of object paths
 * @param data  {Array}
 * @param levels {String[]}
 * @returns {{}}
 */
export async function coalesce(data: any[], ...levels: string[][]): Promise<any> {
    if (!data) return {};
    let output: any = {};
    let longest = Math.max(...levels.map(l => l.length));
    levels.forEach(level => {
        while (level.length < longest) level.push("");
    });

    let lastLevels = Array(levels.length);
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < lastLevels.length; j++) {
            if (levels[j][i] !== "") {
                lastLevels[j] = levels[j][i];
                lastLevels = [...lastLevels.slice(0, j + 1), ...lastLevels.slice(j + 1).map(() => "")]
            }
        }
        let ref: any = output;
        for (let j = 0; j < lastLevels.length; j++) {
            let currentLevel: string = lastLevels[j];
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
                } else {
                    // Continue
                    if (currentLevel === "") continue;
                    if (!ref[currentLevel]) ref[currentLevel] = {};
                    ref = ref[currentLevel];
                }
            } else {
                // Last level, set no matter what.
                setValue(ref, currentLevel, data[i]);
                break;
            }
        }
    }
    return output;
}

export function asyncReductionFactory(groups: string[][]) {
    return async (pP: Promise<object>, c: string[]) => {
        let p: any = await pP;
        p[c[0]] = await coalesce(c, ...groups);
        return p;
    }
}

export function clean(label: string) {
    let output = label;
    if (output.startsWith("vs.")) output = output.substring(3);
    while (output.startsWith(" ")) output = output.substring(1);
    output = output.split(" ").join("_");
    output = output.split("-").join("_");
    return output;
}