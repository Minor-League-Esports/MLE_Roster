const sheets = require("../sheets");
const util = require("../util");

exports.getPlayerDirectory = async function(){
    console.log("Getting Player Directory Information...");

    const DIRECTORY_SHEET = "13yPS53Oe4B97pRsPM9bV4GFvs6b_nZ6KiqPqjCQDb6E";

    // Get Metadata
    let sheetMetadata = await sheets.sheetMeta(DIRECTORY_SHEET, ["Player Directory", "Games Played", "Ineligible List"]);
    let directoryMeta = sheetMetadata.data.sheets[0].properties.gridProperties;
    let gamesMeta = sheetMetadata.data.sheets[1].properties.gridProperties;
    let ineligibleMeta = sheetMetadata.data.sheets[2].properties.gridProperties;


    // Get Values
    let [directory, games, ineligible] = await sheets.sheetValues(DIRECTORY_SHEET, [
        `Player Directory!A1:${util.columnToLetter(directoryMeta.columnCount)}${directoryMeta.rowCount}`,
        `Games Played!A1:${util.columnToLetter(gamesMeta.columnCount)}${gamesMeta.rowCount}`,
        `Ineligible List!A4:A${ineligibleMeta.rowCount}`

    ]);

    // Parse out headers
    let directory_headers = [directory.data.values[0].map(v => v.split(" ")[0]), directory.data.values[1].map(v => v.split(" ").join("_"))];
    let player_directory = directory.data.values.splice(2);
    let games_headers = games.data.values.splice(0, 3).map(vs => vs.map(v => v.split(" ").join("_").replace(/[^a-zA-Z0-9_]/g, "")));
    let player_games = games.data.values;
    let ineligible_headers = ineligible.data.values.splice(0,3).map(vs => vs.map(v => v.split(" ").join("_").replace(/[^a-zA-Z0-9_]/g, "")));
    let player_ineligible = ineligible.data.values;

    return await Promise.all([
        player_directory.reduce(util.asyncReductionFactory(directory_headers), {}),
        player_games.reduce(util.asyncReductionFactory(games_headers), {}),
        player_ineligible.reduce(util.asyncReductionFactory(ineligible_headers), {})
    ]);

}

exports.getReferenceData = async function(){
    console.log("Getting Reference Helper Data...");
    const REFERENCE_SHEET = "1fOSdkuXaITkkf09ePIK8QnEs4K1KZ0eUJRhZCgyY1VY";
    let referenceMeta = await sheets.sheetMeta(REFERENCE_SHEET, ["MLEIDs", "Current Ranks"]);

    // Get MetaData
    let mleIdsMeta = referenceMeta.data.sheets[0].properties.gridProperties;
    let ranksMeta = referenceMeta.data.sheets[1].properties.gridProperties;

    // Get Values
    let [mleids, currentRanks] = await sheets.sheetValues(REFERENCE_SHEET,[
        `MLEIDs!A1:C${mleIdsMeta.rowCount}`,
        `Current Ranks!A1:I${ranksMeta.rowCount}`
    ]);
    // Get Headers
    let mleid_labels = mleids.data.values.splice(0,1).map(a => a.map(v=> v.split(" ").join("_")));
    let currentRank_labels = currentRanks.data.values.splice(0,1).map(a => a.map(v => v.split(" ").join("_")));


    return await Promise.all([
        mleids.data.values.reduce(util.asyncReductionFactory(mleid_labels), {}),
        currentRanks.data.values.reduce(async (pP,c)=>{
            let [obj, p] = await Promise.all([util.coalesce(c, ...currentRank_labels), pP]);
            if(!Object.keys(p).includes(c[0])) p[c[0]] = {};
            p[c[0]][obj["Tracker_ID"]] = obj;
            return p;
        },{})
    ]);

}