const {google} = require('googleapis');
const functions = require("firebase-functions");
const sheets = google.sheets({
    version: 'v4',
    auth: functions.config().google.sheet_api_key
});

exports.sheetMeta = async (spreadsheetId, ranges) => await sheets.spreadsheets.get({
    spreadsheetId,
    ranges
});

exports.sheetValues = async (spreadsheetId, ranges) => {
    let promises = [];
    ranges.forEach(range => {
        promises.push(sheets.spreadsheets.values.get({
            spreadsheetId,
            majorDimension: "ROWS",
            range
        }))
    })
    let values = await Promise.all(promises);
    return values;
}