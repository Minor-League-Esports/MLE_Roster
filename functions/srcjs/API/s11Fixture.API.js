const sheets = require("../sheets");
const util = require("../util");

// We do not use coalesce because the structure of this data is different enough to warrant a custom function
async function processHomeAwaySheet(data) {
    let output = {};
    let promises = [];
    for (let i = 0; i < data[0].length; i += 3) {
        promises.push(new Promise(resolve => {
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
            resolve();
        }));
    }

    await Promise.all(promises);
    return output;
}

exports.getHomeAway = async function () {
    const MULTI_TOOL_SHEET = "14F0bsIXXIE4lFwUALCZUhH0ihWBtxj3HmazZwVnEEFc";

    const rawData = (await sheets.sheetValues(MULTI_TOOL_SHEET, ["Fixture Home/Away!A1:AP20"]))[0].data.values;

    let data = await processHomeAwaySheet(rawData);


    return data;
}
